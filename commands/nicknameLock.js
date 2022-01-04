// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class NicknameLock extends Command {
  
  constructor(client) {
    super("nicknameLock", "Locks my username (fuck you elthan).", [], "guildMemberUpdate");

    this.targetUser = "357685035865735169";
    
    const guild = client.guilds.cache.get("334798649429327872");
    const member = guild.members.cache.get(this.targetUser);

    member.setNickname(member.user.username);
  }

  async invoke(client, oldMember, newMember) {
    
    if (newMember.user.id = this.targetUser) {
      if(newMember.nickname && oldMember.nickname !== newMember.nickname) {
        try {
          newMember.setNickname(newMember.user.username);
        } catch {};
      }
    }
  }
}