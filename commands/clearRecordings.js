// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");
const path = require("path");
const fs = require("fs");

// Main
module.exports = class ClearRecordings extends Command {
  
  constructor(client) {
    super("clearRecordings", "Clears current recordings.", ["clearRecordings"], "message");
  }

  async invoke(client, message) {

    // Command
    if (await this.isCommand(message)) {
      if (await this.hasPerms(message.member)) {

        const recordingsDir = path.resolve(path.dirname("")) + "/recordings";
        
        fs.readdir(recordingsDir, (err, files) => {
          files.forEach((file) => {
            if (file.includes("mp3")) {
              fs.unlinkSync(`${recordingsDir}/${file}`);
            }
          });

          message.channel.send("Recordings cleared.");
        });
      } else {
        message.channel.send("Invalid permissions.");
      }
    }
  }
}