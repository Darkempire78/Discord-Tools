//here the event start
module.exports = async (client, reaction, user) => {
    //logs when a reaction appears
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
        //REST OF THE CODE HERE
}