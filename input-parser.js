export default class InputParser {
    constructor(url) {
        const search = url.searchParams;

        const board = search.get('board') || search.get('b');
        const [width, height] = board.split('x');
        this.board = [parseInt(width, 10), parseInt(height, 10)];

        const rooms = search.get('rooms') || search.get('r');
        this.rooms = this.parseRooms(rooms);
        
        // const walls = search.get('walls') || search.get('w');
        // this.walls = this.parseWalls(walls);

        this.tokens = this.parseTokens(search.get('tokens') || search.get('t'));
    }

    parseRooms(rooms = '') {
        const r = [];
        if (!rooms) return r;
        for (const room of rooms.split('|')) {
            const [width, height] = room.split('x');
            r.push({ width: parseInt(width, 10), height: parseInt(height, 10) });
        }
        return r;
    }

    // parseWalls(walls = '') {
    //     const w = [];
    //     if (!walls) return w;
    //     for (const wall of walls.split('|')) {
    //         const [position, name, color] = token.split('-');
    //         t.push({
    //             name: name || '',
    //             position: position.split(',') || [],
    //             color: color || '',
    //         });
    //     }
    //     return w;
    // }

    parseTokens(tokens = '') {
        const t = [];
        if (!tokens) return t;
        for (const token of tokens.split('|')) {
            const [position, name, color] = token.split('-');
            t.push({
                name: name || '',
                position: position.split(',') || [],
                color: color || '',
            });
        }
        return t;
    }
}