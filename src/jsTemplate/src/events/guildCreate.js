const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: "guildCreate",
  run: async (client, guild) => {

    const channel = client.channels.cache.get(client.config.logs);
    if (channel) {
      let own = await guild.fetchOwner()

      const embed = new EmbedBuilder()
        .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
        .setTitle(`📥 Joined a Guild !!`)
        .addFields(
          { name: 'Name', value: `\`${guild.name}\`` },
          { name: 'ID', value: `\`${guild.id}\`` },
          { name: 'Owner', value: `\`${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : "Unknown user"}\` ${own.id}\`` },
          { name: 'Member Count', value: `\`${guild.memberCount}\` Members` },
          { name: 'Creation Date', value: `\`${moment.utc(guild.createdAt).format('DD/MMM/YYYY')}\`` },
          { name: `${client.user.username}'s Server Count`, value: `\`${client.guilds.cache.size}\` Severs` }
        )
        .setColor(client.embedColor)
        .setTimestamp()
      channel.send({ embeds: [embed] })
    } else {
      return;
    }
  }

};

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */