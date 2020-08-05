module.exports = class BackgroundOffsetParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        const regex = /^\@.*o([0-9]+):([0-9]+).*$/
        const matches = trimmed.match(regex);
        
        if (matches) {
            const x = parseInt(matches[1]);
            const y = parseInt(matches[2]);

            if (Number.isNaN(x) || Number.isNaN(x)) return false;

            return { x, y };
        }

        return false;
    }
}