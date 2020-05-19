export default class Token {
    constructor({name, position, color, ctx, gridsize, padding}) {
        this.name = name;
        this.left = position[0];
        this.top = position[1];
        this.ctx = ctx;
        this.gridsize = gridsize;
        this.padding = padding;
        this.color = color || 'black';
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
        this.ctx.fillText(
            this.name, 
            this.padding + 5 + this.left * this.gridsize - this.gridsize,
            this.padding + (this.gridsize * 0.5) + 3 + (this.top - 1) * this.gridsize,
        );
        this.ctx.stroke();
        this.ctx.strokeStyle = '';
    }
}