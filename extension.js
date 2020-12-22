// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Others
const pyTools = require('./Tools/pyTools.js');
const jsTools = require('./Tools/jsTools.js');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "discord-completor" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    
    // Generate a python template bot (Discord.py)
	let pyBotTemplate = vscode.commands.registerCommand('discord-completor.pyBotTemplate', function () {
        pyTools.pyCreateTemplateBot();
	});
    context.subscriptions.push(pyBotTemplate);
    
    // Generate a javascript template bot (Discord.js)
	let jsBotTemplate = vscode.commands.registerCommand('discord-completor.jsBotTemplate', function () {
        jsTools.jsCreateTemplateBot();
	});
	context.subscriptions.push(jsBotTemplate);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
