module.exports = {
    name: "shardError",
    run: async (client, error, id) => {
    client.logger.log(`Shard #${id} Errored: ${error}`);
    }
};
  
/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */