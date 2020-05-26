const minZoom = 1;
const maxZoom = 3;

export default class ZoomParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        /* If we've gotten this far, we can assume any number provided
           is the zoom level we're hoping for */
        for (var i = minZoom; i <= maxZoom; i++) {
            let re = new RegExp('^@.*[' + i + '].*$');
            if (re.test(trimmed))
                return i;
        }

        return false;
    }
}