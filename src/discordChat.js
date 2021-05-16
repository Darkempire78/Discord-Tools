const fs = require('fs')

function getDiscordChatWebviewContent (path) {
    let fileContent = fs.readFileSync(path.fsPath, 'utf8');
    return fileContent;
}

// function convertLatestMessages (client, messages) {
//     let messagesConverted = [];
//     console.log(messages.values())
//     for (const message of messages.values()) {
//         console.log(message)
//         let test = {
//             "content": message.content,
//             "author": message.authorID,
//             "authorAvatar": "",
//             "date": message.createdTimestamp.toLocaleString()
//         }
//         messagesConverted.push(test)
//     }
//     console.log(messagesConverted)
//     return messagesConverted
// }

async function convertLatestMessages (client, messages) {
    let messagesConverted = [];

    for (const message of messages) {
        console.log("message.authorID : " + message.author.id)
        const user = await client.users.fetch(message.authorID)
        console.log("user " + user)
        console.log(user)
        let test = {
            "content": message.content,
            "author": message.authorID,
            "authorAvatar": user.displayAvatarURL(),
            "date": message.createdTimestamp.toLocaleString()
        }
        messagesConverted.push(test)
    }
    return messagesConverted
}

// function convertLatestMessages (client, messages) {
//     let messagesConverted = [];
//     console.log(messages)
//     // for (let index = 0; index < messages.length; index++) {
//     //     const element = messages[index];
//     //     console.log(element) 
//     // }

//     for (const iterator of messages) {
//         let message = iterator[1]
//         console.log(message.authorID)
//         let test = {
//             "content": message.content,
//             "author": message.authorID,
//             "authorAvatar": "",
//             "date": message.createdTimestamp.toLocaleString()
//         }
//         messagesConverted.push(test)
//         client.users.fetch(message.authorID).then(user => {
//             console.log("user")
//             console.log(user)
//         })
        
//     }
//     console.log("messagesConverted")
//     console.log(messagesConverted)
//     return messagesConverted
// }

// Exports
// Exports
module.exports = {
    getDiscordChatWebviewContent,
    convertLatestMessages
};