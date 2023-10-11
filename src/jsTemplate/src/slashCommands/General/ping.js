
module.exports = {
    name: 'ping',
    description: 'sends pong!',
    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const api_ping = client.ws.ping;

        interaction.followUp({ content: `Bot Ping: ${api_ping}ms`})
    }
}

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */