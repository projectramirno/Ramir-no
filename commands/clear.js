// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class Clear extends Command {
  
  constructor(client) {
    super("clear", "Clears messages in a dm.", ["clear"], "message");
  }

  async invoke(client, message) {

    if (message.channel.type == "dm" && await this.isCommand(message)) {

      message.channel.messages.fetch().then((messages) => {
        messages.forEach((message) => {
          if (message.author.id == client.user.id) {
            try {
              message.delete();
            } catch {};
          }
        });
      });
    }
  } 
}

