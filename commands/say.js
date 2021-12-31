// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class Say extends Command {
  
  constructor(client) {
    super("say", "Says a message.", ["say", "[...]"], "message");
  }

  async invoke(client, message) {

    const args = await this.getArgs(message);

    // Command
    if (await this.hasPerms(message.member) && await this.isCommand(message)) {

      await message.delete();

      if (args.length > 0) {

        const id = args[0];

        message.guild.channels.cache.forEach((channel) => {
          
        });
      } else {
        // Sending syntax
        message.channel.send(`Syntax: ${(await this.getSyntax()).join("  ")}`);
      } 
    } 
  }
}