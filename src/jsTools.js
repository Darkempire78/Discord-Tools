const vscode = require('vscode');

// Others
const fse = require('fs-extra');


const jsCreateTemplateBot = () => {

    // Get the current folder path
    const currentFolderPath = vscode.workspace.workspaceFolders[0].uri["fsPath"]

    // Copy JavaScript bot Template
    var jsTemplateFolder = vscode.extensions.getExtension("Darkempire78.discord-tools").extensionPath;
    jsTemplateFolder = jsTemplateFolder + "/src/jsTemplate";
                                  
    // To copy a folder or file  
    fse.copy(jsTemplateFolder, currentFolderPath, function (err) {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the bot template!");
        }
        vscode.window.showInformationMessage("Created bot template!");
    });
};

// Exports
exports.jsCreateTemplateBot = jsCreateTemplateBot;