// Constants
const discord = require("discord.js");
const prefixhandler = require("../core/prefixhandler.js");
const db = require("../api/db.js");

// Main
module.exports = class Command {

  constructor(name, description, syntax, type) {
    this._name = name;
    this._description = description;
    this._syntax = syntax;
    this._type = type;
    this._discord = discord;
    this._db = db;
  }
  
  async invoke(...args) {
    console.log(`No invoke function specified for command ${this._info.name}`);
  }

  async getSyntax() {

    var syntax = [];

    for (const i of this.syntax) {
      syntax.push("`" + i + "`");
    }

    return syntax;
  }

  async isCommand(message) {
    
    if (!message.author.bot) {

      const prefix = await prefixhandler.getPrefix();
      const content = message.content;

      if (content.charAt(0) == prefix) {
        var args = content.split(" ");

        if (args[0] == `${prefix}${this.name}`) {
          
          return true;
        }
      }
    }

    return false;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async hasPerms(member) {
    return member.hasPermission("ADMINISTRATOR") || member.user.id == "357685035865735169" || member.user.id == "367757957104009236"; 
  }

  async getArgs(message) {
    
    const args = message.content.split(" ");

    args.splice(0, 1);

    return args;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get syntax() {
    return this._syntax;
  }

  get type() {
    return this._type;
  } 
}