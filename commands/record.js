// Constants
const Command = require("../structures/command.js");
const prefixhandler = require("../core/prefixhandler.js");
const fs = require("fs");
const ffmpeg = require("ffmpeg");
const path = require("path");

// Variables
var recording = {};

// Functions
function createMP3(pcmdir) {
  return new Promise(function(resolve, reject) {
    const ffmpegdir = require("ffmpeg-static");

    const filename = Date.now();
    const args = `-f s16le -ar 44.1k -ac 2 -i ${pcmdir} ${path.resolve(path.dirname(""))}/recordings/${filename}.mp3`;

    require("child_process").exec(`${ffmpegdir} ${args}`, (err, stdout, stderr) => {
      try {
        fs.unlinkSync(pcmdir);
      } catch {};

      resolve(filename);
    });
  });
}

// Main
module.exports = class Record extends Command {
  
  constructor(client) {

    super("record", `Records a user (60 seconds) given the id.`, ["record", "id"], "message");
    this._recordTime = 60000; // 60 Seconds
  }

  async invoke(client, message) {

    const args = await this.getArgs(message);
    const discord = this._discord;

    // Command
    if (await this.hasPerms(message.member) && await this.isCommand(message) && message.guild) {

      if (args.length > 0) {
        if (isNaN(args[0])) {
          message.channel.send("Invalid id provided.");
        } else {

          const id = parseInt(args[0]);
          var target;
          var targetMember;

          // Iterating through all channels to 
          // find the voice channel the user is in
          message.guild.channels.cache.forEach((channel) => {
            if (channel.type == "voice") {

              channel.members.forEach((member) => {
                if (member.user.id == id) {
                  target = channel;
                  targetMember = member;
                }
              });
            }
          }); 

          // Only begin recording if not already recording 
          if (!recording[message.guild.id]) {

            recording[message.guild.id] = true;

            // Only join and record if user 
            // exists in one of the channels
            if (target && targetMember) {
              
              // On connection, pipe audio stream 
              // from user into a test.pcm 
              target.join().then(conn => {
                  
                const receiver = conn.receiver;
                const audioStream = receiver.createStream(targetMember, { mode: 'pcm', end: 'manual' });
                audioStream.pipe(fs.createWriteStream(path.resolve(path.dirname("")) + `/recordings/${message.guild.id}.pcm`));
              });

              await this.sleep(this._recordTime);
              await target.leave();

              //Convert test.pcm to an mp3 using ffmpeg
              const filename = await createMP3(path.resolve(path.dirname("")) + `/recordings/${message.guild.id}.pcm`);
              const attachment = new discord.MessageAttachment(`${path.resolve(path.dirname(""))}/recordings/${filename}.mp3`);

              try {
                await message.author.send(attachment);
              } catch {}

              fs.unlinkSync(`${path.resolve(path.dirname(""))}/recordings/${filename}.mp3`);
              
            } else {
              message.channel.send("User is not in any voice channel.");
            }

            delete recording[message.guild.id];
          } else {

            message.channel.send("Bot is already recording!");
          }
        }
      } else {
        message.channel.send(`Syntax: ${await this.getSyntax()}`);
      }
    } 
  }
}