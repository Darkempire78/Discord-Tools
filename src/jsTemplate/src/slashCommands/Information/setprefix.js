const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");
const db = require("../../models/prefix.js");

module.exports = {
  name: "setprefix",
  description: "Set Custom Prefix",
  options: [
    {
      name: "prefix",
      description: "give me new prefix",
      required: true,
      type: "STRING"
    }
  ],


  run: async (client, interaction, prefix) => {
    await interaction.deferReply({
    });
    const data = await db.findOne({ Guild: interaction.guildId });
    const pre = interaction.options.getString("prefix");
    if (!interaction.member.permissions.has('MANAGE_GUILD')) return await interaction.editReply({
      ephemeral: true, embeds: [new EmbedBuilder().setColor(client.embedColor).setDescription("You must have `Manage Guild` permission to use this command.")]
    }).catch(() => { });

    if (!pre[0]) {
      const embed = new EmbedBuilder()
        .setDescription("Please give the prefix that you want to set")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }
    if (pre[1]) {
      const embed = new EmbedBuilder()
        .setDescription("You can not set prefix a double argument")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }
    if (pre[0].length > 3) {
      const embed = new EmbedBuilder()
        .setDescription("You can not send prefix more than 3 characters")
        .setColor(client.embedColor)
      return await interaction.editReply({ embeds: [embed] });
    }
    if (data) {
      data.oldPrefix = prefix;
      data.Prefix = pre;
      await data.save()
      const update = new EmbedBuilder()
        .setDescription(`Your prefix has been updated to **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp()
      return await interaction.editReply({ embeds: [update] });
    } else {
      const newData = new db({
        Guild: interaction.guildId,
        Prefix: pre,
        oldPrefix: prefix
      });
      await newData.save()
      const embed = new EmbedBuilder()
        .setDescription(`Custom prefix in this server is now set to **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp()
      return await interaction.editReply({ embeds: [embed] });
    }
  }
}

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */