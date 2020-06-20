import template from './template.js';

export default class StairsOverlay {
    get name() {
        return 'stairs';
    }

    render(item, options) {
        return template(options);
    }
}