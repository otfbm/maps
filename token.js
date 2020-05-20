const letters = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
    ['d', 4],
    ['e', 5],
    ['f', 6],
    ['g', 7],
    ['h', 8],
    ['i', 9],
    ['j', 10],
    ['k', 11],
    ['l', 12],
    ['m', 13],
    ['n', 14],
    ['o', 15],
    ['p', 16],
    ['q', 17],
    ['r', 18],
    ['s', 19],
    ['t', 20],
    ['u', 21],
    ['v', 22],
    ['w', 23],
    ['x', 24],
    ['y', 25],
    ['z', 26],
]);

export default class Token {
    constructor({name, position, color, ctx, gridsize, padding}) {
        this.name = name;
        this.left = this.fromLetter(position[0]);
        this.top = position[1];
        this.ctx = ctx;
        this.gridsize = gridsize;
        this.padding = padding;
        this.color = color || 'black';
    }

    fromLetter(letter) {
        return letters.get(letter.toLowerCase());
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.arc(
            this.padding + (this.gridsize * 0.5) + (this.left - 1) * this.gridsize,
            this.padding + (this.gridsize * 0.5) + (this.top - 1) * this.gridsize, 
            this.gridsize * 0.5, // radius is half the gridsize
            0, 
            2 * Math.PI,
        );
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(
            this.name, 
            this.padding + 5 + this.left * this.gridsize - this.gridsize,
            this.padding + (this.gridsize * 0.5) + 3 + (this.top - 1) * this.gridsize,
        );
        this.ctx.stroke();
    }
}