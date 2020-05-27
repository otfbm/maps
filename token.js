export default class Token {
  constructor({ name, color, size }) {
    this.name = name;
    this.color = color || "black";
    this.size = size;
  }

  get type() {
    return 'token';
  }

  tiny(gridsize, zoom) {
    const cx = gridsize / 2;
    const cy = gridsize / 2;
    const r = gridsize / 4 * 0.85;
    const sw = 1 * zoom;
    const text = `${this.name.substr(0, 1)}${this.name.substr(-1)}`
    const fontsize = 10 * zoom;
    return `
    <svg height="${gridsize}" width="${gridsize}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${this.color}" stroke="black" stroke-width="${sw}" />
      <text fill="white" x="${cx * zoom}" y="${cy + 4 * zoom}" font-family="sans-serif" font-size="${fontsize}" text-anchor="middle">${text}</text>
    </svg>
    `;
  }

  medium(gridsize, zoom) {
    const cx = gridsize / 2;
    const cy = gridsize / 2;
    const r = gridsize / 2 * 0.85;
    const sw = 2 * zoom;
    const text = this.name.substr(0, 4);
    const fontsize = 12 * zoom;
    return `
    <svg height="${gridsize}" width="${gridsize}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${this.color}" stroke="black" stroke-width="${sw}" />
      <text fill="white" x="${cx}" y="${cy + 3 * zoom}" font-family="sans-serif" font-size="${fontsize}" text-anchor="middle">${text}</text>
    </svg>
    `;
  }

  large(gridsize, zoom) {
    const cx = gridsize;
    const cy = gridsize;
    const r = gridsize * 0.90;
    const sw = 3 * zoom;
    const text = this.name.substr(0, 9);
    const fontsize = 14 * zoom;
    return `
    <svg height="${gridsize * 2}" width="${gridsize * 2}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${this.color}" stroke="black" stroke-width="${sw}" />
      <text fill="white" x="${cx}" y="${cy + 4 * zoom}" font-family="sans-serif" font-size="${fontsize}" text-anchor="middle">${text}</text>
    </svg>
    `;
  }

  huge(gridsize, zoom) {
    const cx = gridsize * 1.5;
    const cy = gridsize * 1.5;
    const r = gridsize * 1.5 * 0.92;
    const sw = 4 * zoom;
    const text = this.name.substr(0, 14);
    const fontsize = 14 * zoom;
    return `
    <svg height="${gridsize * 3}" width="${gridsize * 3}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${this.color}" stroke="black" stroke-width="${sw}" />
      <text fill="white" x="${cx}" y="${cy + 5 * zoom}" font-family="sans-serif" font-size="${fontsize}" text-anchor="middle">${text}</text>
    </svg>
    `;
  }

  gargantuan(gridsize, zoom) {
    const cx = gridsize * 2;
    const cy = gridsize * 2;
    const r = gridsize * 2 * 0.95;
    const sw = 5 * zoom;
    const text = this.name.substr(0, 18);
    const fontsize = 16 * zoom;
    return `
    <svg height="${gridsize * 4}" width="${gridsize * 4}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${this.color}" stroke="black" stroke-width="${sw}" />
      <text fill="white" x="${cx}" y="${cy + 6 * zoom}" font-family="sans-serif" font-size="${fontsize}" text-anchor="middle">${text}</text>
    </svg>
    `;
  }

  svg(gridsize, zoom) {
    let svg = '';
    if (this.size === 'tiny') {
      svg = this.tiny(gridsize, zoom);
    }

    if (this.size === 'small') {
      svg = this.medium(gridsize, zoom);
    }

    if (this.size === 'medium') {
      svg = this.medium(gridsize, zoom);
    }

    if (this.size === 'large') {
      svg = this.large(gridsize, zoom);
    }

    if (this.size === 'huge') {
      svg = this.huge(gridsize, zoom);
    }

    if (this.size === 'gargantuan') {
      svg = this.gargantuan(gridsize, zoom);
    }

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}
