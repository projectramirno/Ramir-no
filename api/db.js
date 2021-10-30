//Constants
const DB = require("@replit/database");
const db = new DB();

//Main
module.exports = class Database {

  constructor(name) {
    this._name = name;

    (async () => {

      const dbs = await db.list();

      if (!dbs.includes(name)) {
        db.set(name, {});
      }

    })();
  }

  async list() {

    const data = await db.get(this._name);
    const keys = Object.keys(data);

    return keys;
  }

  async contains(key) {

    const data = await db.get(this._name);
    const keys = Object.keys(data);

    return keys.includes(key);
  }

  async raw() {
    return await db.get(this._name);
  }

  async remove(key) {
    
    var data = await db.get(this._name);

    delete data[key];

    db.set(this.name, data);
  }

  async set(key, value) {
    
    var data = await db.get(this._name);
    
    data[key] = value;
    db.set(this._name, data);
  }

  async get(key) {
    const data = await db.get(this._name)

    return data[key];
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}