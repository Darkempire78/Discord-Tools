module.exports = {
    name: "shardReconnecting",
    run: async (client, id) => {
    client.logger.log(`Shard #${id} Reconnecting`);
    }
};
  
/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */