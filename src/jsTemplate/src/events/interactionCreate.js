const pre = require("../models/prefix.js");

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {

        let prefix = client.prefix;
        const ress = await pre.findOne({ Guild: interaction.guildId })
        if (ress && ress.Prefix) prefix = ress.Prefix;

        if (interaction.isCommand()) {

            const SlashCommands = client.slashCommands.get(interaction.commandName);
            if (!SlashCommands) return;

            if (SlashCommands.owner && interaction.author.id !== `${client.owner}`) {
                await interaction.editReply({
                    content: `Only <@801478547893387345> can use this command!`
                }).catch(() => { });
            }

            try {
                await SlashCommands.run(client, interaction, prefix);
            } catch (error) {
                if (interaction.replied) {
                    await interaction.editReply({
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                } else {
                    await interaction.followUp({
                        ephemeral: true,
                        content: `An unexcepted error occured.`
                    }).catch(() => { });
                }
                console.error(error);
            };
        } else return;
    }
};

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */