module.exports = {
  name: "shardDisconnect",
  run: async (client, event, id) => {
    client.logger.warn(`Shard #${id} Disconnected`);
  }
};

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */