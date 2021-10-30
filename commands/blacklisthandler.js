// Constants
const Command = require("../structures/command.js");
const Blacklist = require("../commands/blacklist.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class BlacklistHandler extends Command {
  
  constructor(client) {
    super("blacklist_handler", "Handles voicechat blacklisting.", [], "voiceStateUpdate"); 
  }

  async invoke(client, oldState, newState) {

    if (newState.channel) {

      const guildID = newState.channel.guild.id;
      const blacklistdb = new this._db("blacklist");
      const blacklisttoggledb = new this._db("blacklist_toggle");

      // Command
      if (await blacklisttoggledb.get(guildID)) {
        const data = await blacklistdb.get(guildID);

        if (!(await this.canJoin(newState.id, data))) {

          const member = newState.guild.members.cache.get(newState.id);

          member.voice.kick();
        }
      }
    }
  }

  async canJoin(id, blacklist) {

    for (const i of blacklist) {
      if (i == id) {
        return false;
      }
    }

    return true;
  }
}