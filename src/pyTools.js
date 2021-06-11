const vscode = require('vscode');

// Others
const fse = require('fs-extra');
const path = require("path");


const pyCreateTemplateBot = () => {

    // Get the current folder path
    const currentFolderPath = vscode.workspace.workspaceFolders[0].uri["fsPath"]

    // Copy Python bot Template
    const pyTemplateFolder = path.join(vscode.extensions.getExtension("Darkempire78.discord-tools").extensionPath, "src", "pyTemplate");
                                  
    // To copy a folder or file  
    fse.copy(pyTemplateFolder, currentFolderPath, function (err) {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the bot template!");
        }
        vscode.window.showInformationMessage("Created bot template!");
    });
};

// Exports
exports.pyCreateTemplateBot = pyCreateTemplateBot;