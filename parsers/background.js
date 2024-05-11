import fetch from "node-fetch";

export default class BackgroundParser {
  async parse(query) {
    let backgroundImage = null;
    if (query.bg) {
      const bg = Array.isArray(query.bg) ? query.bg[0] : query.bg;
      const pathname = Buffer.from(bg).toString("base64");
      const bgBaseURL = "https://bg.otfbm.io";
      // const res = await fetch(new URL(pathname, bgBaseURL));
      /*const res = await fetch(bg, {
        headers: { "user-agent": "curl/8.1.1" },
      });*/
      const res = await fetch(bg);

      const contentLength = res.headers.get("content-length");
      // if (contentLength > 1102000) {
      // res.destroy();
      // throw new Error("Background image too large");
      // }

      const buffer = await res.arrayBuffer();

      // if (buffer.byteLength > 1102000) throw new Error("Background image too large");
      try {
        backgroundImage = `data:${res.headers.get(
          "content-type"
        )};base64,${Buffer.from(buffer).toString("base64")}`;
      } catch (err) {
        console.log("background parser error caught:", err);
      }
    }
    return backgroundImage;
  }
}
