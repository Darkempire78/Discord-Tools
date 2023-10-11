
module.exports = {
    name: "shardReady",
    run: async (client, id) => {
    client.logger.log(`Shard #${id} Ready`);
    }
};
  
/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */