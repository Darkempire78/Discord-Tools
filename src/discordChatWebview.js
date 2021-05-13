const fs = require('fs')

function getDiscordChatWebviewContent (path) {
    let fileContent = fs.readFileSync(path.fsPath, 'utf8');
    return fileContent;
}

// Exports
exports.getDiscordChatWebviewContent = getDiscordChatWebviewContent;