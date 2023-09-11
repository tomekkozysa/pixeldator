class ImageDrop {
  constructor(dropzone, onReady) {
    this.dropzone = dropzone;
    this.input = document.querySelector("input", this.dropzone);
    this.file;

    this.onReady = onReady;
    this.init();
  }
  init() {
    this.dropzone.addEventListener("drop", (e) => {
      e.preventDefault();

      const files = e.dataTransfer.files;
      if (files[0].type.match("image")) {
        this.file = files[0];
        this.onImage();
      } else {
        // handle message
      }
    });
  }

  onImage() {
    if (document.querySelector("img", this.dropzone)) {
      document.querySelector("img", this.dropzone).remove();
    }
    const img = document.createElement("img");
    img.setAttribute("src", URL.createObjectURL(this.file));
    this.dropzone.append(img);

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      this.onReady(this.file, { width, height });

      // this.drawImage();
    };
  }
  // drawImage() {
  //   if (!this.img) {
  //     return;
  //   }
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //   this.outputWidth = this.scale * Math.round(this.width);
  //   this.outputHeight = this.scale * Math.round(this.height);
  //   this.canvas.width = this.outputWidth;
  //   this.canvas.height = this.outputHeight;
  //   this.ctx.drawImage(this.img, 0, 0, this.outputWidth, this.outputHeight);
  //   this.onCanvasReady();
  // }
}
