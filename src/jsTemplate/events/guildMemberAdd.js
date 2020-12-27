//here the event starts
module.exports = async (client, member) => {
    //logs when a member joins, make sure to have GuildMemberIntents active in discord.com/developers
    console.log(member + "joined in: " + member.guild.name)
};

