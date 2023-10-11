const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",
    category: "general",
    description: "get the help commands of the bot",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {

        const cmds = client.commands.map((c) => {
            return c
        })
        
        const Embed = new EmbedBuilder()
            .setAuthor({ name: "Help", iconURL: client.user.displayAvatarURL() })
            .setColor(client.embedColor)
            .setDescription('Ping, setprefix, invite')
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.avatarURL({ dynamic: true }) })
            .setTimestamp();
        
        message.channel.send({ embeds: [Embed] })
    }
}

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */