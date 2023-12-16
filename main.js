const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let fileName = "";
let root = document.getElementById("demo");
let inputNode = root.getElementsByTagName("input")[0];
let processNode = root.getElementsByTagName("button")[0];
let histogramCanvasNode = root.getElementsByTagName("canvas")[1];
let histogramContext = histogramCanvasNode.getContext("2d");

let imgData = null;

let histogram = Array.from({
    length: 3
}, () => {
    return Array.from({
        length: 256
    }, () => 0);
});

let minHistogram = Array.from({
    length: 3
}, () => 0);
let maxHistogram = Array.from({
    length: 3
}, () => 0);

let cdf = Array.from({
    length: 3
}, () => {
    return Array.from({
        length: 256
    }, () => 0);
});

const downloadBtn = document.getElementById("download-btn");
const uploadFile = document.getElementById("upload-file");
const revertBtn = document.getElementById("revert-btn");


// Filter & Effect Handlers
document.addEventListener("click", e => {
    if (e.target.classList.contains("filter-btn")) {
        if (e.target.classList.contains("brightness-add")) {
            Caman("#canvas", img, function() {
                this.brightness(5).render();
            });
        } else if (e.target.classList.contains("brightness-remove")) {
            Caman("#canvas", img, function() {
                this.brightness(-5).render();
            });
        } else if (e.target.classList.contains("contrast-add")) {
            Caman("#canvas", img, function() {
                this.contrast(5).render();
            });
        } else if (e.target.classList.contains("contrast-remove")) {
            Caman("#canvas", img, function() {
                this.contrast(-5).render();
            });
        } else if (e.target.classList.contains("saturation-add")) {
            Caman("#canvas", img, function() {
                this.saturation(5).render();
            });
        } else if (e.target.classList.contains("saturation-remove")) {
            Caman("#canvas", img, function() {
                this.saturation(-5).render();
            });
        } else if (e.target.classList.contains("vibrance-add")) {
            Caman("#canvas", img, function() {
                this.vibrance(5).render();
            });
        } else if (e.target.classList.contains("vibrance-remove")) {
            Caman("#canvas", img, function() {
                this.vibrance(-5).render();
            });
        } else if (e.target.classList.contains("exposure-add")) {
            Caman("#canvas", img, function() {
                this.exposure(5).render();
            });
        } else if (e.target.classList.contains("exposure-remove")) {
            Caman("#canvas", img, function() {
                this.exposure(-5).render();
            });
        } else if (e.target.classList.contains("noise-add")) {
            Caman("#canvas", img, function() {
                this.noise(5).render();
            });
        } else if (e.target.classList.contains("noise-remove")) {
            Caman("#canvas", img, function() {
                this.noise(-5).render();
            });
        } else if (e.target.classList.contains("sharpen-add")) {
            Caman("#canvas", img, function() {
                this.sharpen(5).render();
            });
        } else if (e.target.classList.contains("sharpen-remove")) {
            Caman("#canvas", img, function() {
                this.sharpen(-5).render();
            });
        } else if (e.target.classList.contains("sepia-add")) {
            Caman("#canvas", img, function() {
                this.sepia(5).render();
            });
        } else if (e.target.classList.contains("sepia-remove")) {
            Caman("#canvas", img, function() {
                this.sepia(-5).render();
            });
        } else if (e.target.classList.contains("hue-add")) {
            Caman("#canvas", img, function() {
                this.hue(5).render();
            });
        } else if (e.target.classList.contains("hue-remove")) {
            Caman("#canvas", img, function() {
                this.hue(-5).render();
            });
        } else if (e.target.classList.contains("blur-add")) {
            Caman("#canvas", img, function() {
                this.stackBlur(5).render();
            });
        } else if (e.target.classList.contains("blur-remove")) {
            Caman("#canvas", img, function() {
                this.stackBlur(-5).render();
            });
        } else if (e.target.classList.contains("gamma-add")) {
            Caman("#canvas", img, function() {
                this.gamma(5).render();
            });
        } else if (e.target.classList.contains("gamma-remove")) {
            Caman("#canvas", img, function() {
                this.gamma(-5).render();
            });
        } else if (e.target.classList.contains("clip-add")) {
            Caman("#canvas", img, function() {
                this.clip(5).render();
            });
        } else if (e.target.classList.contains("clip-remove")) {
            Caman("#canvas", img, function() {
                this.clip(-5).render();
            });
        } else if (e.target.classList.contains("retro-add")) {
            Caman("#canvas", img, function() {
                this.vintage().render();
            });
        } else if (e.target.classList.contains("grey-add")) {
            Caman("#canvas", img, function() {
                this.greyscale().render();
            });
        } else if (e.target.classList.contains("grungy-add")) {
            Caman("#canvas", img, function() {
                this.grungy().render();
            });
        } else if (e.target.classList.contains("glowingSun-add")) {
            Caman("#canvas", img, function() {
                this.glowingSun().render();
            });
        } else if (e.target.classList.contains("hazyDays-add")) {
            Caman("#canvas", img, function() {
                this.hazyDays().render();
            });
        } else if (e.target.classList.contains("clarity-add")) {
            Caman("#canvas", img, function() {
                this.clarity().render();
            });
        }
    }
});

// Revert Filters
revertBtn.addEventListener("click", e => {
    Caman("#canvas", img, function() {
        this.reset();
    });
});

// Upload File
uploadFile.addEventListener("change", () => {
    // Get File
    const file = document.getElementById("upload-file").files[0];
    // Init FileReader API
    const reader = new FileReader();

    // Check for file
    if (file) {
        // Set file name
        fileName = file.name;
        // Read data as URL
        reader.readAsDataURL(file);
    }

    // Add image to canvas
    reader.addEventListener(
        "load",
        () => {
            // Create image
            img = new Image();
            // Set image src
            img.src = reader.result;
            // On image load add to canvas
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.removeAttribute("data-caman-id");
                imgData = ctx.getImageData(0,0,img.width,img.height);
                calcHistogram();
                drawHistogram();
            };
        },
        false
    );
});

let calcHistogram = function() {
    //clear
    for (let c = 0; c < 3; c += 1) {
        for (let i = 0; i < 256; i += 1){
            histogram[c][i] = 0;
        }
    }

    //calc.
    for (let i = 0, l = imgData.data.length; i < l; i += 4) {
        for (let c = 0; c < 3; c += 1) {
            histogram[c][imgData.data[i + c]] += 1;
        }
    }

    //get range
    for (let c = 0; c < 3; c += 1) {
        minHistogram[c] = histogram[c].reduce((m, v) => Math.min(m, v), 0);
        maxHistogram[c] = histogram[c].reduce((m, v) => Math.max(m, v), 0);
    }
};

// draw histogram
let drawHistogram = function() {

    //set histogram size
    histogramCanvasNode.width = 256*3;
    histogramCanvasNode.height = 120;

    //draw histogram
    for (let c = 0; c < 3; c += 1) {
        //select color
        switch (c) {
            case 0:
                histogramContext.strokeStyle = "rgb(255, 0, 0)";
                break;
            case 1:
                histogramContext.strokeStyle = "rgb(0, 255, 0)";
                break;
            case 2:
                histogramContext.strokeStyle = "rgb(0, 0, 255)";
                break;
        }

        //draw line
        histogramContext.beginPath();
        let min = minHistogram[c];
        let max = maxHistogram[c];
        for (let x = 0; x < 256; x += 1) {
            let v = Math.round(100 * (histogram[c][x] - min ) / max);
            histogramContext.moveTo(x * 3 + c, 120 - v);
            histogramContext.lineTo(x * 3 + c, 120);
        }
        histogramContext.stroke();
    }
};

// histogram equalization
let histogramEqualization = function() {
    // calculate CDF
    calcHistogram();
    for (let c = 0; c < 3; c += 1) {
        cdf[c][0] = histogram[c][0];
        for (let i = 1; i < 256; i += 1) {
            cdf[c][i] = cdf[c][i - 1] + histogram[c][i];
        }
    }

    //create new image
    let newData = ctx.createImageData(imgData.width, imgData.height);
    let max = imgData.width * imgData.height;
    for (let c = 0; c < 3; c += 1) {
        let min = cdf[c][0];
        for (let i = 0, l = imgData.data.length; i < l; i += 4) {
            let v = cdf[c][imgData.data[i + c]];
            newData.data[i + c] = Math.round(255 * (v - min) / (max - min));
            newData.data[i + 3] = 255;
        }
    }
    ctx.putImageData(newData, 0, 0);
    imgData = newData;

    //draw new histogram
    calcHistogram();
    drawHistogram();
};

processNode.onclick = histogramEqualization;
// Download Event
downloadBtn.addEventListener("click", () => {
    // Get ext
    const fileExtension = fileName.slice(-4);

    // Init new filename
    let newFilename;

    // Check image type
    if (fileExtension === ".jpg" || fileExtension === ".png") {
        // new filename
        newFilename = fileName.substring(0, fileName.length - 4) + "-edited.jpg";
    }

    // Call download
    download(canvas, newFilename);
});

// Download
function download(canvas, filename) {
    // Init event
    let e;
    // Create link
    const link = document.createElement("a");

    // Set props
    link.download = filename;
    link.href = canvas.toDataURL("image/jpeg", 0.8);
    // New mouse event
    e = new MouseEvent("click");
    // Dispatch event
    link.dispatchEvent(e);
}







