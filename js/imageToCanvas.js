class ImageToCanvas {
  constructor(output, onReady) {
    this.img;
    this.output = output;

    this.output = output;
    this.ctx = this.output.getContext("2d");

    this.outputWidth;
    this.outputHeight;
    this.scale = 1;
    this.onReady = onReady;
  }
  setScale(val) {
    this.scale = val;
  }

  set source(src) {
    this.img = document.createElement("img");
    this.img.setAttribute("src", URL.createObjectURL(src));

    this.img.onload = () => {
      this.width = this.img.naturalWidth;
      this.height = this.img.naturalHeight;
      console.log("image loaded", this.width, this.height);
      this.display();
    };
  }

  drawImage() {
    if (!this.img) return;
    else this.display();
  }

  display() {
    console.log("display", this.img);

    this.ctx.clearRect(0, 0, this.output.width, this.output.height);
    this.outputWidth = this.scale * Math.round(this.width);
    this.outputHeight = this.scale * Math.round(this.height);
    this.output.width = this.outputWidth;
    this.output.height = this.outputHeight;
    this.ctx.drawImage(this.img, 0, 0, this.outputWidth, this.outputHeight);
    if (this.onReady)
      this.onReady({ width: this.outputWidth, height: this.outputHeight });
  }
}
