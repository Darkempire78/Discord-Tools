const { EmbedBuilder, Permissions } = require("discord.js");
const db = require("../models/prefix.js");

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {

    if (message.author.bot) return;
    if (!message.guild) return;
    let prefix = client.prefix;
    const channel = message?.channel;
    const ress = await db.findOne({ Guild: message.guildId })
    if (ress && ress.Prefix) prefix = ress.Prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(`**› My prefix in this server is \`${prefix}\`**\n**› You can see my all commands type \`${prefix}\`help**`);
      message.channel.send({ embeds: [embed] })
    };
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (!message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) return await message.author.dmChannel.send({ content: `I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });

    if (!message.guild.me.permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) return;

    if (!message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) return await message.channel.send({ content: `I don't have **\`EMBED_LINKS\`** permission to execute this **\`${command.name}\`** command.` }).catch(() => { });

    const embed = new EmbedBuilder()
      .setColor("RED");

    // args: true,
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      // usage: '',
      if (command.usage) {
        reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
      }

      embed.setDescription(reply);
      return message.channel.send({ embeds: [embed] });
    }

    if (command.permission && !message.member.permissions.has(command.permission)) {
      embed.setDescription("You can't use this command.");
      return message.channel.send({ embeds: [embed] });
    }
    if (!channel.permissionsFor(message.guild.me)?.has(Permissions.FLAGS.EMBED_LINKS) && client.user.id !== userId) {
      return channel.send({ content: `Error: I need \`EMBED_LINKS\` permission to work.` });
    }
    if (command.owner && message.author.id !== `${client.owner}`) {
      embed.setDescription("Only <@801478547893387345> can use this command!");
      return message.channel.send({ embeds: [embed] });
    }

    try {
      command.execute(message, args, client, prefix);
    } catch (error) {
      console.log(error);
      embed.setDescription("There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately.");
      return message.channel.send({ embeds: [embed] });
    }
  }
};

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */