// Constants
const Command = require("../structures/command.js");

const fs = require("fs");
const path = require("path");
const prefixhandler = require("../core/prefixhandler.js");

// Functions
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Main
module.exports = class Lucas extends Command {
  constructor (client) {
    super("lucas", "Plays a lucas noise", ["lucas"], "message");
  }

  async invoke(client, message) {

    if (message.guild) {
      if (await this.isCommand(message)) {
        
        const id = message.author.id;
        var target;

        // Iterating through all the channels
        message.guild.channels.cache.forEach((channel) => {

          // Checking if channel is a voice channel 
          if (channel.type == "voice") {
            
            // Checking if user resides in channel
            channel.members.forEach((member) => {

              // Checking if vc contains the target user
              if (member.user.id == id) {

                // Set target to this vc
                target = channel;
              }
            });
          }
        });

        if (target) {
          
          const selected = `${path.resolve(path.dirname(""))}/resources/${getRandomInt(6) + 1}.mp3`;

          target.join().then((connection) => {
            const player = connection.play(selected);

            player.on("finish", () => {
              target.leave()
            });
          });

        } else {
          message.channel.send("You are not in a voice channel!");
        }
      }
    }
  }
}