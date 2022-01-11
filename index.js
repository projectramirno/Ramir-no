//Constants
const fs = require("fs");
const discord = require("discord.js");
const path = require("path");

const homeDir = path.resolve(path.dirname(""));
const commandDir = `${homeDir}/commands`;

const server = require(`${homeDir}/core/server.js`);
const db = require(`${homeDir}/api/db.js`);

const client = new discord.Client();
const token = process.env.token;

//Main
(async () => {

  client.setMaxListeners(0);
  const files = await fs.promises.readdir(commandDir);

  for (const file of files) {
    
    client.on("ready", () => {

      // Loading commands
      const commandName = file.substring(0, file.length - 3);
      const command = new (require(`${commandDir}/${commandName}.js`))(client);

      client.on(command.type, (...args) => {
        (async () => { await command.invoke(client, ...args); })();
      });
    });
  }
})();

server.start();
client.login(token);