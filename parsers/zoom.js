const minZoom = 1;
const maxZoom = 5;

module.exports = class ZoomParser {
    parse(str) {
        let trimmed = str.trim();
        if (trimmed[0] === '/') trimmed = trimmed.substr(1);
        if (trimmed[trimmed.length-1] === '/') trimmed = trimmed.substr(0, trimmed.length - 1);

        /* If we've gotten this far, we can assume any number provided
           is the zoom level we're hoping for */
        for (var i = minZoom; i <= maxZoom; i++) {
            let re = new RegExp('^@.*[' + i + '].*$');
            if (re.test(trimmed)) {
                switch (i) {
                    case 1:
                        return 0.5;
                    case 2:
                        return 0.75;
                    case 3:
                        return 1;
                    case 4:
                        return 1.5;
                    case 5:
                        return 2;
                }
            }
        }

        return false;
    }
}