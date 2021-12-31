// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");

// Main
module.exports = class RateLimit extends Command {
  
  constructor(client) {
    super("ratelimit", "ratelimits a user from voice chat.", ["ratelimit", "<(add, remove)>", "<(@user)>"], "message");
  }

  async invoke(client, message) {

    if (message.guild) {
      
      const guild = message.guild;
      const guildID = guild.id;
      const ratelimitdb = new this._db("ratelimit");

      // Setting up database preconditions
      if (!(await ratelimitdb.contains(guildID))) {
          await ratelimitdb.set(guildID, {});
      }
      
      // Command
      if (await this.isCommand(message)) { 

        if (await this.hasPerms(message.member)) {

          const args = await this.getArgs(message);

          if (args.length == 2) {

            var data = await ratelimitdb.get(guildID);
            var userid;
            const member = message.mentions.members.first();

            if (member) {
              userid = member.user.id;

              if (args[0] == "add") {
                
                if (!await this.hasPerms(member)) {
                  
                  if (!data[userid]) {
                    data[userid] = 0;

                    await ratelimitdb.set(guildID, data);

                    message.channel.send("User added to ratelimit.");

                  } else {
                    message.channel.send("User already ratelimited.");
                  }

                } else {
                  message.channel.send("Cannot ratelimit that user.");
                }
                
              } else if (args[0] == "remove") {

                if (data[userid]) {

                  delete data[userid];
                  await ratelimitdb.set(guildID, data);

                  message.channel.send("User unratelimited.");

                } else {
                  message.channel.send("User is not ratelimited.");
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
  }
}