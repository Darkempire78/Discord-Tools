const fs = require('fs')

function getDiscordChatWebviewContent (path) {
    let fileContent = fs.readFileSync(path.fsPath, 'utf8');
    return fileContent;
}

async function convertLatestMessages(client, messages) {
    let messagesConverted = [];
    
    for (let message of messages.values()) {
        // Author avatar
        let avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        if (message.author.avatar) avatar = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`
        // Escape HTML
        message.cleanContent = message.cleanContent.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
        
        let messageConverted = {
            content: message.cleanContent,
            author: message.author.username,
            authorAvatar: avatar,
            date: message.createdAt.toLocaleString(),
        };
        messagesConverted.push(messageConverted);
    }
    return messagesConverted.reverse();
}


// Exports
module.exports = {
    getDiscordChatWebviewContent,
    convertLatestMessages
};