const fetch = require("node-fetch");

module.exports = class BackgroundParser {
  async parse(query) {
    let backgroundImage = null;
    if (query.bg) {
      const bg = Array.isArray(query.bg) ? query.bg[0] : query.bg;
      const pathname = Buffer.from(bg).toString("base64");
      const bgBaseURL = "https://bg.otfbm.io";
      const res = await fetch(new URL(pathname, bgBaseURL));

      const contentLength = res.headers.get("content-length");
      if (contentLength > 1102000) {
        res.destroy();
        throw new Error("Background image too large");
      }

      const buffer = await res.buffer();

      if (buffer.byteLength > 1102000) throw new Error("Background image too large");

      backgroundImage = `data:${res.headers.get(
        "content-type"
      )};base64,${buffer.toString("base64")}`;
    }
    return backgroundImage;
  }
};
