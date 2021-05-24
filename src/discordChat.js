const fs = require('fs')
// https://github.com/markdown-it/markdown-it
let md = require('markdown-it')({
                linkify: true
            })
            .disable(["image", "heading", "list"])
            .enable(["blockquote", "linkify"])

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
        const messageCleanContent = convertMessageContent(client, message);
        
        let messageConverted = {
            author: message.author.username,
            authorAvatar: avatar,
            content: messageCleanContent,
            id: message.id,
            date: message.createdAt.toLocaleString()
        };
        messagesConverted.push(messageConverted);
    }
    return messagesConverted.reverse();
}

function convertMessageContent(client, message) {
    // Escape HTML
    let messageContentConverted = message.cleanContent.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
    
    // Convert to markdown
    messageContentConverted = md.render(messageContentConverted);
    
    // Custom emojis
    const emojiRegex = new RegExp(/&lt;a:.+?:\d+&gt;|&lt;:.+?:\d+&gt;/g); // Because "<" and ">" are replaced by "&lt;" and "&gt;"
    const emojis = messageContentConverted.match(emojiRegex);
    if (emojis) {
        for (const emoji of emojis) {
            let emojiID = emoji.replace("&gt;", "").split(":"); // remove ">" at the end
            const customEmoji = client.emojis.cache.get(emojiID[emojiID.length - 1]);
            messageContentConverted = messageContentConverted.replace(emoji, `<img src="${customEmoji.url}" alt="[EmojiLoadingFailed]" style="max-height:22px; max-width:22;">`);
        }
    } 

    // If edited
    if (message.editedAt) {
        messageContentConverted += " <span style=\"font-size: 8px; color: #72767d; user-select: none;\">(modified)</span>";
    }

    // Message Attachments
    // Images
    if (message.attachments.size > 0) {
        message.attachments.forEach(attachment => {
            const extension = attachment.url.split(".")
            const avilableImageExtensions = ["jpg", "png", "gif"];
            if (avilableImageExtensions.includes(extension[extension.length - 1])) {
                messageContentConverted = `<img src="${attachment.url}" alt="[ImageLoadingFailed : ${attachment.url}]" style="max-height:400px; max-width:400px;">`;
            }
        });
    }

    // Tenof Gifs from url
    // if (messageContentConverted != "") {
    //     let messageContentConvertedList = messageContentConverted.split(" ");
    //     const wordNumber = messageContentConvertedList.lenght;
    //     let isAlone = false;
    //     if (wordNumber == 1) { 
    //         isAlone = true 
    //     };
    //     // Check if it's a gif
    //     for (let i of messageContentConvertedList) {
    //         if (i.startsWith("https://tenor.com")) {

    //         }
    //     }
    // }
    
    return messageContentConverted
}

// Exports
module.exports = {
    getDiscordChatWebviewContent,
    convertLatestMessages,
    convertMessageContent
};