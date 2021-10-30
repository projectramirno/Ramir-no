//Constants
const db = require("../api/db.js");
const prefixdb = new db("prefix");

const defaultprefix = "!";

//Functions
async function getPrefix(id) {
  var prefix = defaultprefix;

  if (await prefixdb.contains(id)) {
    prefix = (await prefixdb.raw())[id];
  } else {
    prefixdb.set(id, defaultprefix);
  }

  return prefix;
}

//Main
module.exports.getPrefix = getPrefix;