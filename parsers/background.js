const backgrounds = new Map([
    ['=1', './backgrounds/grass.png']
]);

export default class BackgroundParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        // a zoom value between #1 and #3
        if (/^=[1-9]$/.test(trimmed)) {
            return backgrounds.get(trimmed);
        }

        return false;
    }
}