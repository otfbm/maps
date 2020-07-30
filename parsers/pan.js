module.exports = class PanParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        const matches = trimmed.match(/^([0-9][0-9]?):([0-9][0-9]?)$/);
        if (matches && !Number.isNaN(matches[1]) && !Number.isNaN(matches[2])) {
            let x = parseInt(matches[1], 10);
            let y = parseInt(matches[2], 10);
            if (x > 99) x = 99;
            if (y > 99) y = 99;
            return { x, y };
        }

        return false;
    }
}