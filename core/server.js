//Constants
const app = require("express")();

//Variables
var server;

//Functions
function start() {
  server = app.listen(3001, function() {
    //console.clear();
  });

  app.all("/", function(req, res) {
    res.send("");
  });

  return server;
}

function stop() {
  if (server) {
    server.close();
    server = null;
  }
}

//Main
module.exports.start = start;
module.exports.stop = stop;