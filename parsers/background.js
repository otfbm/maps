const fetch = require('node-fetch');

module.exports = class BackgroundParser {
    async parse(query) {
        let backgroundImage = null;
        if (query.bg) {
            try {
                const res = await fetch(query.bg);
                const buffer = await res.buffer();
                backgroundImage = `data:${
                    res.headers.get("content-type")
                };base64,${buffer.toString("base64")}`;
            } catch (err) {
                // noop
            }
        }      
        return backgroundImage;
    }
}