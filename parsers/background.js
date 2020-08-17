const fetch = require('node-fetch');

module.exports = class BackgroundParser {
    async parse(query) {
        let backgroundImage = null;
        if (query.bg) {
            const bgendpoint = "https://bg.otfbm.io/";
            const bgurl = bgendpoint + Buffer.from(query.bg).toString('base64');
            const res = await fetch(bgurl);

            const contentLength = res.headers.get('content-length');
            if (contentLength > 1102000) {
                res.destroy();
                throw new Error('Background too large');
            }
            
            const buffer = await res.buffer();

            if (buffer.byteLength > 1102000)
                throw new Error('Background too large');

            backgroundImage = `data:${
                res.headers.get("content-type")
            };base64,${buffer.toString("base64")}`;
        }      
        return backgroundImage;
    }
}