// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class Prefix extends Command {
  
  constructor(client) {
    super("prefix", "Gets bot prefix for server.", ["prefix"], "message");
  }

  async invoke(client, message) {

    const args = await this.getArgs(message);

    // Command
    if (args.length == 0) {
      if (message.mentions.members.first() && message.mentions.members.first().user.id) {
        message.channel.send("Prefix: `" + await prefixhandler.getPrefix() + "`");
      }
    }
  }
}