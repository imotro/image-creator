class HexToPNG {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.colors = [];
    this.width = 0;
    this.height = 0;
  }

  hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  init(colors, width, height) {
    this.colors = colors;
    this.width = width;
    this.height = height;
  }

  createPng() {
    const numColors = this.colors.length;
    const numRows = Math.ceil(numColors / this.width);
    
    this.canvas.width = this.width;
    this.canvas.height = numRows * this.height;

    for (let i = 0; i < numColors; i++) {
        let color;
        if (typeof this.colors[i] === 'string') {
            color = this.hexToRgb(this.colors[i]);
        } else if (typeof this.colors[i] === 'object') {
            color = this.colors[i];
        } else {
            throw new Error(`Unsupported color format at index ${i}`);
        }

        const row = Math.floor(i / this.width);
        const col = i % this.width;

        this.ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
        this.ctx.fillRect(col, row * this.height, 1, this.height);
    }

    const dataUrl = this.canvas.toDataURL('image/png');

    // Clean up the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = 0;
    this.canvas.height = 0;

    return dataUrl;
}


  download() {
    const dataUrl = this.createPng();

    // Create a download link for the PNG image
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'output.png';
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up the download link element
    document.body.removeChild(downloadLink);
  }
}
