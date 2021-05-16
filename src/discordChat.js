const fs = require('fs')

function getDiscordChatWebviewContent (path) {
    let fileContent = fs.readFileSync(path.fsPath, 'utf8');
    return fileContent;
}

async function convertLatestMessages(client, messages) {
    let messagesConverted = [];
  
    for (const message of messages.values()) {
        const user = await client.users.fetch(message.member.id);
        let messageConverted = {
            content: message.content,
            author: message.author.username,
            authorAvatar: user.displayAvatarURL(),
            date: message.createdTimestamp.toLocaleString(),
        };
        messagesConverted.push(messageConverted);
    }
    return messagesConverted;
}


// Exports
module.exports = {
    getDiscordChatWebviewContent,
    convertLatestMessages
};