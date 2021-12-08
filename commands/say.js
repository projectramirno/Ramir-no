// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class Prefix extends Command {
  
  constructor(client) {
    super("say", "Says a message.", ["say", "[...]"], "message");
  }

  async invoke(client, message) {

    const args = await this.getArgs(message);

    // Command
    if (await this.hasPerms(message.member) && await this.isCommand(message)) {

      await message.delete();

      if (args.length > 0) {
        await message.channel.send(args.join(" "));
      } 
    } 
  }
}