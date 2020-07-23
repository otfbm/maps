const template = require('./template.js');

module.exports = class StairsOverlay {
    get name() {
        return 'stairs';
    }

    render(item, options) {
        return template(options);
    }
}