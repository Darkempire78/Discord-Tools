module.exports = {
    name: "shardResume",
    run: async (client, id, replayedEvents) => {
    client.logger.log(`Shard #${id} Resumed`);
    }
};
  
/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */