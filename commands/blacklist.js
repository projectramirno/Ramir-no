// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class Blacklist extends Command {
  
  constructor(client) {
    super("blacklist", "Blacklists a user from voice chat.", ["blacklist", "<(add, remove), (enable, disable)>", "<(@user), ()>"], "message");

    const blacklisttoggledb = new this._db("blacklist_toggle");
    const blacklistdb = new this._db("blacklist");

    client.guilds.cache.forEach(function(guild) {

      (async () => {

        // Setting up database preconditions
        if (!(await blacklistdb.contains(guild.id))) {
          await blacklistdb.set(guild.id, []);
        }

        if (!(await blacklisttoggledb.contains(guild.id))) {
          await blacklisttoggledb.set(guild.id, false);
        }

        // Kick blacklisted users initially once bot starts
        const blacklist = await blacklistdb.get(guild.id);
        
        if (await blacklisttoggledb.get(guild.id)) {
          for (const member of guild.members.cache) {
            var canJoin = true;

            for (const i of blacklist) {
              if (i == member[0]) {
                canJoin = false;
              }
            }

            if (member[1].voice.channel && !canJoin) {
              member[1].voice.kick();
            }
          }
        }
      })();
    });
  }

  async invoke(client, message) {

    const guild = message.channel.guild;
    const guildID = guild.id;
    const blacklisttoggledb = new this._db("blacklist_toggle");
    const blacklistdb = new this._db("blacklist");

    // Setting up database preconditions
    if (!(await blacklistdb.contains(guildID))) {
      await blacklistdb.set(guildID, []);
    }

    if (!(await blacklisttoggledb.contains(guildID))) {
      await blacklisttoggledb.set(guildID, false);
    }
    
    // Command
    if (await this.isCommand(message)) { 

      if (await this.hasPerms(message.member)) {

        const args = await this.getArgs(message);

        if (args.length == 1) {
          const data = await blacklisttoggledb.get(guildID);

          if (data && args[0] == "disable") {
            await blacklisttoggledb.set(guildID, false);

            message.channel.send("Voice channel blacklist disabled.");

          } else if (args[0] == "enable") {
            await blacklisttoggledb.set(guildID, true);

            message.channel.send("Voice channel blacklist enabled.");

            this.kickBlacklistedUsers(guild);
          }

        } else if (args.length == 2) {

          var data = await blacklistdb.get(guildID);
          var userid;
          const member = message.mentions.members.first();

          if (member) {
            userid = member.user.id;

            if (args[0] == "add") {
              
              if (!await this.hasPerms(member)) {
                
                if (!data.includes(userid)) {
                  data.push(userid);

                  await blacklistdb.set(guildID, data);

                  if (await blacklisttoggledb.get(guildID)) {
                    this.kickBlacklistedUsers(guild);
                  }

                  message.channel.send("User added to blacklist.");
                  
                } else {
                  message.channel.send("User already blacklisted.");
                }
              } else {
                message.channel.send("Cannot blacklist that user.");
              }
              
            } else if (args[0] == "remove") {

              if (data.includes(userid)) {

                await data.splice(data.indexOf(userid));
                await blacklistdb.set(guildID, data);

                message.channel.send("User removed from blacklist.");

              } else {
                message.channel.send("User is not blacklisted.");
              }
            }
          } else {
            message.reply("No user mentioned.");
          }

        } else {
          message.channel.send(`Syntax: ${(await this.getSyntax()).join("  ")}`);
        }
      } else {
        message.channel.send("Invalid permissions.");
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

  async kickBlacklistedUsers(guild) {

    const blacklistdb = new this._db("blacklist");

    if (await blacklistdb.contains(guild.id)) {
      for (const member of guild.members.cache) {

        if (member[1].voice.channel && !(await this.canJoin(member[0], await blacklistdb.get(guild.id)))) {
          member[1].voice.kick();
        }
      }
    }
  }
}