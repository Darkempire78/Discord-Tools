const vscode = require('vscode');

function createStatusBarItem(discordStatusBarItem) {
    //only ever want one status bar item
    if (discordStatusBarItem === undefined) {
        discordStatusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            1
        );
    }
    return discordStatusBarItem
}
    
function showStatusBarItem(discordStatusBarItem) {
    // https://code.visualstudio.com/api/references/icons-in-labels
    discordStatusBarItem.show();
}

function updateStatusBarItem(discordStatusBarItem, text) {
    discordStatusBarItem.text = text;
}

module.exports = {
    createStatusBarItem,
    showStatusBarItem,
    updateStatusBarItem
};