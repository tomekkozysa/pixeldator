class Pixeldator {
  constructor(source, canvas, onUpdate) {
    this.source = source;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.sourcectx = this.source.getContext("2d");
    this.cellWidth;
    this.cellHeight;
    this.pixelData = [];
    this.vertical = false;
    this.onUpdate = onUpdate;
    this.mapsize = 8;
    this.reducex = 30;
    this.reducey = 40;
  }
  log() {
    console.log(
      "\ncellWidth",
      this.cellWidth,
      "\ncellHeight",
      this.cellHeight,
      "\nvertical",
      this.vertical,
      "\nmapsize",
      this.mapsize,
      "\nreducex",
      this.reducex,
      "\nreducey",
      this.reducey,
      "\nwidth",
      this.width,
      "\nheight",
      this.height,
      "\ncolours",
      this.mapsize
    );
  }
  exportPixelData() {
    let clipboard = document.querySelector("#clipboardInput");
    if (!clipboard) {
      clipboard = document.createElement("input");
      clipboard.id = "clipboardInput";
      clipboard.type = "text";
    }

    console.log("export", clipboard);
    clipboard.value = `[${this.pixelData}]`;
    console.log(clipboard.value);
    clipboard.select();
    navigator.clipboard.writeText(clipboard.value);
  }
  getAsJSON() {
    const json = {
      width: this.reducex,
      height: this.reducey,
      cellwidth: this.cellWidth,
      cellheight: this.cellHeight,
      mapsize: this.mapsize,
      timestamp: Date.now(),
      data: this.pixelData,
    };
    return JSON.stringify(json);
  }
  setSize(w, h) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }
  range(inmin, inmax, outmin, outmax, value) {
    return ((value - inmin) * (outmax - outmin)) / (inmax - inmin) + outmin;
  }

  reduce(reducex, reducey, mapsize) {
    this.mapsize = mapsize;
    this.reducex = reducex;
    this.reducey = reducey;

    if (this.vertical) {
      this.vertical_reduce(reducex, reducey, mapsize);
    } else {
      this.horizontal_reduce(reducex, reducey, mapsize);
    }
  }

  vertical_reduce(reducex, reducey, mapsize) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pixelData = [];
    this.cellWidth = this.canvas.width / reducex;
    this.cellHeight = this.canvas.height / reducey;
    // if(1 ==1 ){
    // 	this.cellHeight = this.cellWidth;
    // }
    for (let c = 0; c < reducex; c++) {
      for (let r = 0; r < reducey; r++) {
        let startx = c * this.cellWidth;
        let starty = r * this.cellHeight;

        let imgdata = this.sourcectx.getImageData(
          startx,
          starty,
          this.cellWidth,
          this.cellHeight
        );

        let pix = imgdata.data;
        let sq_avg = 0;
        let sq_avg_count = 0;

        for (let i = 0; i < pix.length; i += 4) {
          let avg = (pix[i] + pix[i + 1] + pix[i + 2]) / 3;
          sq_avg += avg;
          sq_avg_count++;
        }
        let mappedValue = Math.round(
          this.range(0, 255, 0, mapsize, sq_avg / sq_avg_count)
        );
        let reduced_avg = Math.round((256 / mapsize) * mappedValue);

        this.pixelData.push(mappedValue);
        this.ctx.fillStyle = `rgb(${reduced_avg}, ${reduced_avg}, ${reduced_avg})`;
        this.ctx.fillRect(startx, starty, this.cellWidth, this.cellHeight);
      }
    }
    this.onUpdate();
  }

  horizontal_reduce(reducex, reducey, mapsize) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.pixelData = [];
    this.cellWidth = this.canvas.width / reducex;
    this.cellHeight = this.canvas.height / reducey;
    for (let r = 0; r < reducey; r++) {
      for (let c = 0; c < reducex; c++) {
        let startx = c * this.cellWidth;
        let starty = r * this.cellHeight;

        let imgdata = this.sourcectx.getImageData(
          startx,
          starty,
          this.cellWidth,
          this.cellHeight
        );

        let pix = imgdata.data;
        let sq_avg = 0;
        let sq_avg_count = 0;

        for (let i = 0; i < pix.length; i += 4) {
          let avg = (pix[i] + pix[i + 1] + pix[i + 2]) / 3;
          sq_avg += avg;
          sq_avg_count++;
        }
        let mappedValue = Math.round(
          this.range(0, 255, 0, mapsize, sq_avg / sq_avg_count)
        );
        let reduced_avg = Math.round((255 / (mapsize - 1)) * mappedValue);

        this.pixelData.push(mappedValue);

        this.ctx.fillStyle = `rgb(${reduced_avg}, ${reduced_avg}, ${reduced_avg})`;

        this.ctx.fillRect(startx, starty, this.cellWidth, this.cellHeight);
      }
    }

    this.onUpdate();
  }
}
