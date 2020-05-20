export default class InputParser {
    constructor(query) {
        const board = query.board || query.b;
        const [width, height] = board.split('x');
        this.board = [parseInt(width, 10), parseInt(height, 10)];

        const rooms = query.rooms || query.r;
        this.rooms = this.parseRooms(rooms);
        
        // const walls = query.walls || query.w;
        // this.walls = this.parseWalls(walls);

        this.tokens = this.parseTokens(query.tokens || query.t);
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
                position,
                color: color || '',
            });
        }
        return t;
    }
}