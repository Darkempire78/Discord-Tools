// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Others
const pyTools = require('./src/pyTools.js');
const jsTools = require('./src/jsTools.js');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "discord-tools" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    
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
                
                let packageManager = await vscode.window.showQuickPick(Object.keys(library.package_manager), { "placeHolder": 'Select a package manager' });
                
                if (packageManager) {
                    // Create the bot template
                    jsTools.jsCreateTemplateBot();
                    
                    // Download packages
                    let terminal = vscode.window.createTerminal({ "hideFromUser": false, "name": "Install packages"});
                    terminal.show();
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

            // Get the good documentation
            const language = document.languageId;

            const languages = {
                "javascript": {
                    "classic": "https://discord.js.org/#/docs/main/stable/general/welcome",
                    "search": "https://discord.js.org/#/docs/main/stable/search?q="
                },
                "python": {
                    "classic": "https://discordpy.readthedocs.io/en/latest/api.html",
                    "search": "https://discordpy.readthedocs.io/en/latest/search.html?q="
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

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
