const { EmbedBuilder, CommandInteraction, Client, MessageButton, MessageActionRow } = require("discord.js")

module.exports = {
    name: "invite",
    description: "get my invite link",
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });


        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Invite")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`),
                new MessageButton()
                    .setLabel("Support")
                    .setStyle("LINK")
                    .setURL("https://discord.gg/YAaaNJwrsK")
            );

        const mainPage = new EmbedBuilder()
            .setColor('#303236')
            .addField('invite apex', `[Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot)`, true)
        await interaction.followUp({ embeds: [mainPage], components: [row] })
    }
}

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */