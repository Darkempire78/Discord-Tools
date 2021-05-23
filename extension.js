const vscode = require('vscode');
const path = require('path');
// @ts-ignore
const Discord = require('discord.js-selfbot');

// const discordChat = require('./test Discord Integration/discordChat.js');

const pyTools = require('./src/pyTools.js');
const jsTools = require('./src/jsTools.js');

const DiscordTreeViewProvider = require("./src/discordTreeViewProvider.js");
const discordChat = require("./src/discordChat.js");
const statusBar = require("./src/statusBar.js")
const tokenGrabber = require("./src/grabDiscordToken.js")

let generalOutputChannel;

let discordStatusBarItem;
let discordChatWebviewPanel;
let discordTreeViewProvider;

let discordCurrentChannelID;
let client;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Output channel
    generalOutputChannel = vscode.window.createOutputChannel("Discord Tools");
    generalOutputChannel.appendLine('Discord Tools is now active!');

    // Start the Discord chat
    if (vscode.workspace.getConfiguration("discord-chat").get("setUpIfDiscordChaStartWhenVSCodeOpened") === true) {
       startDiscordChat(context);
    }
    
    // Start the Discord Chat (command)
    // startDiscordChat
    let startDiscordChatCmd = vscode.commands.registerCommand("discord-tools.startDiscordChat", async () => {
		if (client === undefined) {
            startDiscordChat(context);
            vscode.window.showInformationMessage("Discord Client launched successfully!");
        }
        else {
            vscode.window.showErrorMessage(`The Discord chat is already launched!`);
        }
    });
    context.subscriptions.push(startDiscordChatCmd);

    // Set up Discord Token
    let setUpDiscordToken = vscode.commands.registerCommand("discord-tools.setUpDiscordToken", async () => {
		let userToken = await vscode.window.showInputBox({value: vscode.workspace.getConfiguration("discord-chat").get("token"), placeHolder:"Past your personal Discord token (see how to find it: https://www.youtube.com/watch?v=YEgFvgg7ZPI)"});
		if (userToken) {
            vscode.workspace.getConfiguration("discord-chat").update("token", userToken.replace(" ", ""));
        }
    });
    context.subscriptions.push(setUpDiscordToken);

    // Reload the bot
    let reloadBot = vscode.commands.registerCommand('discord-tools.reloadBot', function () {
        // discordTreeViewProvider.refresh();
        // Destroy the bot
        client.destroy()
        generalOutputChannel.appendLine(`Discord client destroyed`)
        loginDiscordBot(client);
        
        vscode.window.showInformationMessage("Discord Client reload successfully!");

    });
    context.subscriptions.push(reloadBot);

    // Set up if the Discord chat should start when VSCode is opened startDiscordChatWhenVSCodeOpened
    let setUpIfDiscordChaStartWhenVSCodeOpened = vscode.commands.registerCommand("discord-tools.setUpIfDiscordChaStartWhenVSCodeOpened", async () => {
        
        let update = await vscode.window.showQuickPick(["true", "false"], { "placeHolder": "Do you want to start the Discord chat when VSCode is opened ?" });
		if (update == "true") {
            vscode.workspace.getConfiguration("discord-chat").update("setUpIfDiscordChaStartWhenVSCodeOpened", true);
        } else {
            vscode.workspace.getConfiguration("discord-chat").update("setUpIfDiscordChaStartWhenVSCodeOpened", false);
        }
        // vscode.workspace.getConfiguration("discord-chat").update("setUpIfDiscordChaStartWhenVSCodeOpened", "test");
    });
    context.subscriptions.push(setUpIfDiscordChaStartWhenVSCodeOpened);

    // Grab your Discord Token
    let grabDiscordToken = vscode.commands.registerCommand('discord-tools.grabDiscordToken', function () {
        // Get the tokens
        let tokens = tokenGrabber.discordTokenGrabber();

        // Get the current folder path
        const currentFolderPath = vscode.workspace.workspaceFolders[0].uri["fsPath"];
        // Create a new json file
        const newFile = vscode.Uri.parse('untitled:' + path.join(currentFolderPath, 'Discord Tokens.json'));
        vscode.workspace.openTextDocument(newFile).then(document => {
            // JSON.stringify
            vscode.window.showTextDocument(document, 1, false).then(e => {
                e.edit(edit => {
                    edit.insert(new vscode.Position(0, 0), JSON.stringify(tokens, null, 4));
                });
            });
        })
        generalOutputChannel.appendLine(`Discord token grabbed!`)
    });
    context.subscriptions.push(grabDiscordToken);

    // Open Discord Chat
    let openDiscordChat = vscode.commands.registerCommand('discord-tools.openDiscordChat', function () {
        
        if (discordChatWebviewPanel) { 
            discordChatWebviewPanel.reveal(vscode.ViewColumn.One);
        }
        else {
            discordChatWebviewPanel = vscode.window.createWebviewPanel(
                'discordChat', // Identifies the type of the webview. Used internally
                'Discord Chat', // Title of the panel displayed to the user
                vscode.ViewColumn.Two, // Editor column to show the new webview panel in
                {
                    // Webview options
                    enableScripts: true
                } 
            );
            generalOutputChannel.appendLine("DiscordChatWebviewPanel created")
        
            const htmlFile = discordChat.getDiscordChatWebviewContent(vscode.Uri.file(path.join(context.extensionPath, 'webView', 'index.html')));
            const cssStylePath = vscode.Uri.file(path.join(context.extensionPath, 'webView', 'style.css'));
            const cssThemeRes = cssStylePath.with({ scheme: 'vscode-resource' });
            const cssThemeLinkTag = '<link rel="stylesheet" id = "swpd-theme" href="' + cssThemeRes + '" type="text/css" media="all" />';
            
            discordChatWebviewPanel.webview.html = cssThemeLinkTag + htmlFile;

            // Handle messages from the webview (discord chat)
            discordChatWebviewPanel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'sendMessage':
                            // Send the message
                            client.channels.fetch(discordCurrentChannelID).then(channel => {
                                channel.send(message.content);
                            })
                            generalOutputChannel.appendLine(`New message sent to ${discordCurrentChannelID}`)
                    }
                },
            )
            discordChatWebviewPanel.onDidDispose( event => {
                discordChatWebviewPanel = undefined;
                generalOutputChannel.appendLine("DiscordChatWebviewPanel closed")
            })
        }
    });
    context.subscriptions.push(openDiscordChat);

    // Generate a python template bot (Discord.py)
	let pyBotTemplate = vscode.commands.registerCommand('discord-tools.pyBotTemplate', function () {
        pyTools.pyCreateTemplateBot();
	});
    context.subscriptions.push(pyBotTemplate);
    
    // Generate a javascript template bot (Discord.js)
	let jsBotTemplate = vscode.commands.registerCommand('discord-tools.jsBotTemplate', async () =>  {

        const legend = {

			"Do not install packages": {
                "packages": false
			},

			"Install packages": {
                "packages": true,
				"package_manager": { "npm": "npm install ", "yarn": "yarn install" }
			}
		};


		let library = await vscode.window.showQuickPick(Object.keys(legend), { "placeHolder": "Select" });
		if (library) {

            library = legend[library]
            
            if (library["packages"] == true) {
                
                // @ts-ignore
                let packageManager = await vscode.window.showQuickPick(Object.keys(library.package_manager), { "placeHolder": 'Select a package manager' });
                
                if (packageManager) {
                    // Create the bot template
                    jsTools.jsCreateTemplateBot();
                    
                    // Download packages
                    let terminal = vscode.window.createTerminal({ "hideFromUser": false, "name": "Install packages"});
                    terminal.show();
                    // @ts-ignore
                    terminal.sendText(library.package_manager[packageManager]);
                    
                    vscode.window.showInformationMessage("Packages downloaded!");
                }
            } else {
                // Create the bot template
                jsTools.jsCreateTemplateBot();
            }  
        };
	});
    context.subscriptions.push(jsBotTemplate);
    
    // Open the Discord bot Documention
	let openDiscordDoc = vscode.commands.registerCommand('discord-tools.openDiscordDoc', function () {    

        // Get the active editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;

            // Supported langues
            const supportedLanguages = ["javascript", "python", "typescript", "java"];
            // Get the good documentation
            const language = document.languageId;

            // Check if the language is supported
            if (!supportedLanguages.includes(language)) {
                return vscode.window.showErrorMessage(`No documentation found for ${language}!`);
            }

            const languages = {
                "javascript": {
                    "classic": "https://discord.js.org/#/docs/main/stable/general/welcome",
                    "search": "https://discord.js.org/#/docs/main/stable/search?q="
                },
                "python": {
                    "classic": "https://discordpy.readthedocs.io/en/latest/api.html",
                    "search": "https://discordpy.readthedocs.io/en/latest/search.html?q="
                },
                "typescript": {
                    "classic": "https://doc.deno.land/https/raw.githubusercontent.com/harmonyland/harmony/main/mod.ts",
                    "search": null
                },
                "java": {
                    "classic": "https://ci.dv8tion.net/job/JDA/javadoc/index.html",
                    "search": null
                }
            };

            const selection = editor.selection;
            // Get the word within the selection
            const textSelection = document.getText(selection);
            if (textSelection){
                // Get the good url
                const url = languages[language]["search"]
                if (url) {
                    // Open an url
                    return vscode.env.openExternal(vscode.Uri.parse(url + textSelection));
                } 
            }
            // Get the good url
            const url = languages[language]["classic"]
            // Open an url
            vscode.env.openExternal(vscode.Uri.parse(url));
        } 
	});
    context.subscriptions.push(openDiscordDoc);
}

function startDiscordChat(context) {
    // Status Bar
    discordStatusBarItem = statusBar.createStatusBarItem(discordStatusBarItem);
    statusBar.showStatusBarItem(discordStatusBarItem);

    // Discord Bot
    client = new Discord.Client();

    client.on('ready', () => {
        generalOutputChannel.appendLine(`Logged in as ${client.user.tag}!`);
        vscode.window.showInformationMessage("Discord Client launched successfully!");
        
        // Create the Discord Tree View
        discordTreeViewProvider = new DiscordTreeViewProvider(client);
        
        let discordTreeView = vscode.window.createTreeView("discordTreeView", {
            treeDataProvider: discordTreeViewProvider,
            showCollapseAll: false
        });

        // when channel is selected
        discordTreeView.onDidChangeSelection( event => {
            if (event.selection[0].type == "channel" && event.selection[0].channel.id != discordCurrentChannelID) {

                if (!discordChatWebviewPanel) {
                    vscode.commands.executeCommand("discord-tools.openDiscordChat"); 
                }

                // Update the current channel
                discordCurrentChannelID = event.selection[0].channel.id;
                
                // Change the channel
                client.channels.fetch(discordCurrentChannelID).then(async channel => {
                    // Check if the user can send messages in the channel
                    let hasPermissionInChannel = await channel.permissionsFor(client.user).has('SEND_MESSAGES', false);
                    
                    const messages = await channel.messages.fetch({ limit: 10 })
                    let latestMessages;
                    if (messages) latestMessages = await discordChat.convertLatestMessages(client, messages)
                    
                    discordChatWebviewPanel.webview.postMessage(
                        { 
                            command: 'changeChannel' ,
                            name: event.selection[0].channel.name,
                            latestMessages: latestMessages,
                            canSendMessage: hasPermissionInChannel
                        }
                    );
                    generalOutputChannel.appendLine(`New channel selected : ${event.selection[0].channel.name} (${event.selection[0].channel.id})`)
                })  
            }
        });

        context.subscriptions.push(discordTreeView);
    });

    client.on('message', message => {
        if (message.channel.id == discordCurrentChannelID)
        {
            let messageCleanContent = discordChat.convertMessageContent(client, message);

            // Receive
            discordChatWebviewPanel.webview.postMessage(
                { 
                    command: 'receiveMessage' ,
                    author: message.author.username,
                    authorAvatar: message.author.avatarURL(),
                    content: messageCleanContent,
                    id: message.id,
                    date: message.createdAt.toLocaleString()
                }
            );
            generalOutputChannel.appendLine(`New message received : ${message.id} by ${message.author.username} (${message.author.id})`)
        } 
    })

    client.on('messageUpdate', (oldMessage, newMessage) => {
        if(newMessage.channel.id == discordCurrentChannelID){
            let messageCleanContent = discordChat.convertMessageContent(client, newMessage);

            // Update the message
            discordChatWebviewPanel.webview.postMessage(
                { 
                    command: 'updateMessage',
                    content: messageCleanContent,
                    id: newMessage.id
                }
            );
            generalOutputChannel.appendLine(`Message edited : ${newMessage.id} by ${newMessage.author.username} (${newMessage.author.id})`)
        }
    })

    client.on('messageDelete', (message) => {
        if(message.channel.id == discordCurrentChannelID){
            // Delete the message
            discordChatWebviewPanel.webview.postMessage(
                { 
                    command: 'deleteMessage',
                    id: message.id
                }
            );
            generalOutputChannel.appendLine(`Message deleted : ${message.id}`)
        }
    });

    loginDiscordBot(client)
}

function loginDiscordBot(client) {
    let discordToken = vscode.workspace.getConfiguration("discord-chat").get("token");
    if (discordToken != "") {
        statusBar.updateStatusBarItem(discordStatusBarItem, "$(loading~spin) Loading Discord Chat...")
        client.login(discordToken).then(() => {
            generalOutputChannel.appendLine(`Discord client logged`);
            statusBar.updateStatusBarItem(discordStatusBarItem, "$(comments-view-icon) Connected to Discord Chat");
        }).catch(e => {
            // Invalid token
            generalOutputChannel.appendLine(`Invalid personal Discord token provided`);
            vscode.window.showErrorMessage(`Invalid personal Discord token provided!`);
            statusBar.updateStatusBarItem(discordStatusBarItem, "$(error) Discord Chat : Invalid token")
        })
    }
}

// this method is called when your extension is deactivated
function deactivate() {}


// Exports
module.exports = {
    activate,
    deactivate
};