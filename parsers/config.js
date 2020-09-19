const fetch = require("node-fetch");

module.exports = class ConfigParser {
  async parse(query) {
    let config = null;
    if (query.load) {
      try {
        const res = await fetch(query.load);
        config = await res.json();
      } catch (err) {
        throw new Error("Unable to load config from the provided URL");
      }
    }
    return config;
  }
};
