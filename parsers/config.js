const fetch = require("node-fetch");

async function fetchConfig(url) {
  const res = await fetch(url);
  return await res.json();
}

function deepMerge(...sources) {
  let acc = {};
  for (const source of sources) {
    if (source instanceof Array) {
      if (!(acc instanceof Array)) {
        acc = [];
      }
      acc = [...acc, ...source];
    } else if (source instanceof Object) {
      for (let [key, value] of Object.entries(source)) {
        if (value instanceof Object && key in acc) {
          value = deepMerge(acc[key], value);
        }
        acc = { ...acc, [key]: value };
      }
    }
  }
  return acc;
}

module.exports = class ConfigParser {
  async parse(query) {
    let config = null;
    try {
      if (query.load) {
        const urls = Array.isArray(query.load) ? query.load : [query.load];
        const configs = await Promise.all(urls.map((url) => fetchConfig(url)));
        config = deepMerge({}, ...configs);
      }
    } catch (err) {
      throw new Error("Unable to load config from the provided URL(s)");
    }
    return config;
  }
};
