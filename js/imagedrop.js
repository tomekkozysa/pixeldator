console.log("image drop");
class ImageDrop {
	constructor(zone, canvas, onCanvasReady) {
		this.zone = zone;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.input = document.querySelector("input", this.zone);
		this.previewImage;
		this.width = 0;
		this.height = 0;
		this.outputWidth;
		this.outputHeight;
		this.scale = 1;
		this.onCanvasReady = onCanvasReady;
		this.img;
		this.init();
	}
	init() {
		this.input.addEventListener("change", () => {
			// const files = this.input.files;
		});

		this.zone.addEventListener("drop", (e) => {
			e.preventDefault();

			const files = e.dataTransfer.files;
			if (files[0].type.match("image")) {
				this.previewImage = files[0];
			}
			this.display();
		});
	}
	setScale(val) {
		this.scale = val;
		this.drawImage();
	}
	display() {
		if (document.querySelector("img", this.zone)) {
			document.querySelector("img", this.zone).remove();
		}
		this.img = document.createElement("img");
		this.img.setAttribute("src", URL.createObjectURL(this.previewImage));
		this.zone.append(this.img);

		this.img.onload = () => {
			this.width = this.img.naturalWidth;
			this.height = this.img.naturalHeight;

			this.drawImage();
		};
	}
	drawImage() {
		if (!this.img) {
			return;
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		const bbox = this.zone.getBoundingClientRect();
		this.outputWidth = this.scale * Math.round(this.width);
		this.outputHeight = this.scale * Math.round(this.height);
		this.canvas.width = this.outputWidth;
		this.canvas.height = this.outputHeight;
		this.ctx.drawImage(this.img, 0, 0, this.outputWidth, this.outputHeight);
		this.onCanvasReady();
	}
}
