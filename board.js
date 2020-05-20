const p = 10;

export default class Board {
    constructor({ width, height, gridsize, padding, ctx, strokeStyle = "#CCCCCC" }) {
        this.width = width;
        this.height = height;
        this.gridsize = gridsize;
        this.ctx = ctx;
        this.padding = padding;
        this.strokeStyle = strokeStyle;
    }

    draw() {
        this.ctx.beginPath();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.width * this.gridsize, this.height * this.gridsize);

        for (let i = 0; i <= this.width; i += this.gridsize) {
            this.ctx.moveTo(0.5 + i + this.padding, this.padding);
            this.ctx.lineTo(0.5 + i + this.padding, this.height + this.padding);
        }
    
        for (let i = 0; i <= this.height; i += this.gridsize) {
            this.ctx.moveTo(this.padding, 0.5 + i + this.padding);
            this.ctx.lineTo(this.width + this.padding, 0.5 + i + this.padding);
        }

        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.stroke();
        this.ctx.strokeStyle = '';
    }
}