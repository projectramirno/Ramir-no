// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class Delete extends Command {
  
  constructor(client) {
    super("delete", "Deletes messages.", ["delete", "<(number)>"], "message");
  }

  async invoke(client, message) {

    const args = await this.getArgs(message);

    try {
      // Command
      if (await this.hasPerms(message.member) && await this.isCommand(message)) {

        if (args.length == 1 && !isNaN(args[0])) {
          await message.channel.bulkDelete(parseInt(args[0]) + 1);
        }
      } 
    } catch (error) {
      // 
    }
  } 
}