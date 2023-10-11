const { EmbedBuilder } = require("discord.js");
const db = require("../../models/prefix.js");
module.exports = {
  name: "setprefix",
  category: "Config",
  description: "Set Custom Prefix",
  args: false,
  usage: "",
  aliases: ["prefix"],
  permission: [],
  owner: false,
  execute: async (message, args, client, prefix) => {

    const data = await db.findOne({ Guild: message.guildId });
    const pre = await args.join(" ")
    if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply('You must have `Manage Guild` permission to use this command.');
    if (!pre[0]) {
      const embed = new EmbedBuilder()
        .setDescription("Please give the prefix that you want to set!")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }
    if (pre[1]) {
      const embed = new EmbedBuilder()
        .setDescription("You can not set prefix a double argument")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }
    if (pre[0].length > 3) {
      const embed = new EmbedBuilder()
        .setDescription("You can not send prefix more than 3 characters")
        .setColor(client.embedColor)
      return message.reply({ embeds: [embed] });
    }
    if (data) {
      data.oldPrefix = prefix;
      data.Prefix = pre;
      await data.save()
      const update = new EmbedBuilder()
        .setDescription(`Your prefix has been updated to **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp()
      return message.reply({ embeds: [update] });
    } else {
      const newData = new db({
        Guild: message.guildId,
        Prefix: pre,
        oldPrefix: prefix
      });
      await newData.save()
      const embed = new EmbedBuilder()
        .setDescription(`Custom prefix in this server is now set to **${pre}**`)
        .setColor(client.embedColor)
        .setTimestamp()
      return message.reply({ embeds: [embed] });

    }
  }
};

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */