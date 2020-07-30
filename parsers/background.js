const fetch = require('node-fetch');

module.exports = class BackgroundParser {
    async parse(query) {
        let backgroundImage = null;
        if (query.bg) {
            try {
                const res = await fetch(query.bg);

                const contentLength = res.headers.get('content-length');
                if (contentLength > 1000000) {
                    res.destroy();
                    throw new Error('Background too large');
                }
                
                const buffer = await res.buffer();

                if (buffer.byteLength > 1000000)
                    throw new Error('Background too large');

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