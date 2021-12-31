// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class RateLimitHandler extends Command {
  
  constructor(client) {
    super("ratelimit_handler", "Handles ratelimiting.", [], "message"); 
  }

  async invoke(client, message) {

    if (message.guild) {
      const guildID = message.channel.guild.id;
      const ratelimitdb = new this._db("ratelimit");
      const data = await ratelimitdb.get(guildID);
      const currentsec = Math.floor(Date.now() / 1000);
      const ratelimit = 86400; // seconds 

      // Setting up database preconditions
      if (!(await ratelimitdb.contains(guildID))) {
        await ratelimitdb.set(guildID, {});
      }

      if (data && message.author.id !== client.user.id) {
        if (data[message.author.id] != undefined) {

          if (currentsec - data[message.author.id] < ratelimit) {
            message.delete();

          } else {
            data[message.author.id] = currentsec;
            await ratelimitdb.set(guildID, data);
          }
        }
      }
    }
  }
}