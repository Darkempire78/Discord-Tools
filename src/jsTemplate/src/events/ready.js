const { prefix } = require("../config.js");

module.exports = {
    name: "ready",
    run: async (client) => {
        client.logger.log(`${client.user.username} online!`);
        client.logger.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);

        //Game
        let statuses = ['/help', `Prefix ${prefix}`];
        setInterval(function () {
            let status = statuses[Math.floor(Math.random() * statuses.length)];
            client.user.setActivity(status, { type: "PLAYING" });
        }, 10000)
    }
}

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */