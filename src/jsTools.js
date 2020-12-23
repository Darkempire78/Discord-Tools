const vscode = require('vscode');

// Others
const fs = require("fs");
const path = require("path");


const jsCreateMainFile = () => {
    // Get the current folder path
    const currentFolderPath = vscode.workspace.workspaceFolders[0].uri["fsPath"]

    // Code to add in the new file
    const jsMainScript = `const Discord = require('discord.js');
const config = require('./configuration.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Take commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
\tconst command = require(\`./commands/\${file}\`);
\tclient.commands.set(command.name, command);
}

// Cooldowns
const cooldowns = new Discord.Collection();

// On Ready
client.once('ready', () => {
\tconsole.log('Ready!');
});

// On Message
client.on('message', message => {
\tif (!message.content.startsWith(config.prefix) || message.author.bot) return;

\tconst args = message.content.slice(config.prefix.length).split(/ +/);
\tconst commandName = args.shift().toLowerCase();

\tconst command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
\t// If command exist
\tif (!command) return;

\t// Check if command can be executed in DM
\tif (command.guildOnly && message.channel.type !== 'text') {
\t\treturn message.reply('I can\\'t execute that command inside DMs!');
\t}

\t// Check if args are required
\tif (command.args && !args.length) {
\t\tlet reply = \`You didn't provide any arguments, \${message.author}!\`;

\t\tif (command.usage) {
\t\t\treply += \`\\nThe proper usage would be: \\\`\${config.prefix}\${command.name} \${command.usage}\\\`\`;
\t\t}

\t\treturn message.channel.send(reply);
\t}

\t// Check if user is in cooldown
\tif (!cooldowns.has(command.name)) {
\t\tcooldowns.set(command.name, new Discord.Collection());
\t}
    
\tconst now = Date.now();
\tconst timestamps = cooldowns.get(command.name);
\tconst cooldownAmount = (command.cooldown || 3) * 1000;
    
\tif (timestamps.has(message.author.id)) {
\t\tconst expirationTime = timestamps.get(message.author.id) + cooldownAmount;

\t\tif (now < expirationTime) {
\t\t\t// If user is in cooldown
\t\t\tconst timeLeft = (expirationTime - now) / 1000;
\t\t\treturn message.reply(\`please wait \${timeLeft.toFixed(1)} more second(s) before reusing the \\\`\${command.name}\\\` command.\`);
\t\t}  
\t} else {
\t\ttimestamps.set(message.author.id, now);
\t\tsetTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
\t\t// Execute command
\t\ttry {
\t\t\tcommand.execute(message, args);
\t\t} catch (error) {
\t\t\tconsole.error(error);
\t\t\tmessage.reply('there was an error trying to execute that command!');
\t\t}
\t}  
});

client.login(config.token);`;

    // Create and write the index.js file
    fs.writeFile(path.join(currentFolderPath, "index.js"), jsMainScript, err => {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the index.js file!");
        }
        vscode.window.showInformationMessage("Created index.js file!");
    });

};


const jsCreateTemplateBot = () => {

    // Get the current folder path
    const currentFolderPath = vscode.workspace.workspaceFolders[0].uri["fsPath"]

    // CREATE FOLDERS
    // Create the commands folder
    fs.mkdir(path.join(currentFolderPath, "commands"), function(err) {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the commands folder!");
        }
        vscode.window.showInformationMessage("Created commands folder!"); 
    });

    // CREATE FILES

    // Create the index.js file 
    jsCreateMainFile();

    // Create the configuration.json file
    const configurationJson = `{
\t"token": "",
\t"prefix": ""
}`;
    fs.writeFile(path.join(currentFolderPath, "configuration.json"), configurationJson, err => {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the configuration.json file!");
        }
        vscode.window.showInformationMessage("Created configuration.json file!"); 
    });

    // Create the ping command
    const jsPingCommand = `const config = require('../config.json');

module.exports = {
\tname: "ping",
\tdescription: "ping pong",
\texecute(message, args) {
\t\tmessage.reply('pong!');
\t},
};`;
    fs.writeFile(path.join(currentFolderPath, "commands/ping.js"), jsPingCommand, err => {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the ping.js file!");
        }
        vscode.window.showInformationMessage("Created ping.js file!");
    });
};

// Exports
exports.jsCreateTemplateBot = jsCreateTemplateBot;