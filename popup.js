var out = document.getElementById("output");
var copybtn = document.getElementById("copy");
var to64 = document.getElementById("to");
var from64 = document.getElementById("from");
var tobtn = document.getElementById("convert");
var input = document.getElementById("file");
var canvas = document.getElementById("cnv");
var download = document.getElementById("download");
var clear = document.getElementById("clear");
var selector = document.getElementById("fileTypeSelector");
var state, string;
var img, fr, file, type, b64Type;
var setting = 0;

to.addEventListener('click', function(event) {
  setting = 0;
  tobtn.style.display = "none";
  copybtn.style.display = "inline";
  download.style.display = "none";
  clear.style.display = "none";
  selector.style.display = "none";
});
from64.addEventListener('click', function(event) {
  setting = 1;
  tobtn.style.display = "inline";
  copybtn.style.display = "none";
  download.style.display = "inline-block";
  clear.style.display = "inline";
  selector.style.display = "inline";
});
clear.addEventListener('click', function(event) {
  out.value = null;
});
selector.addEventListener('change', function(event) {
  b64Type = this.value;
});
document.getElementsByTagName("option")[1].value;

input.addEventListener("change", detect);
tobtn.addEventListener("click", createImage);

function detect() {
  type = input.files[0].type;
  document.getElementById("fileName").innerHTML = input.files[0].name;
  convert();
}

function convert() {
  if (setting == 0) {
    input = document.getElementById("file");
    file = input.files[0];
    fr = new FileReader();
    fr.onload = createImage;   // onload fires after reading is complete
    fr.readAsDataURL(file);
  }
}

function createImage() {
  img = new Image();
  img.onload = imageLoaded;
  if (setting == 0) {
    img.src = fr.result;
  }
  if (setting == 1) {
    string = "data:" + b64Type + ";base64,";
    state = out.value.indexOf(string);
    if (b64Type == undefined || b64Type == "media type") {
      alert("Select a media type");
    }else if (state == -1) {
      out.value = string + out.value;
      img.src = out.value;
    } else {
      img.src = out.value;
    }
  }
}

function imageLoaded() {
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img,0,0);
  if (setting == 0) {
    out.value = img.src;
  }
}

copybtn.addEventListener('click', function(event) {
  out.select();
  document.execCommand('copy');
});

download.addEventListener('click', function() {
    downloadCanvas(this);
}, false);

function downloadCanvas(link) {
    link.href = img.src;
    var ext;
    if (b64Type == "image/png") { ext = "png"}
    if (b64Type == "image/jpeg") { ext = "jpg"}
    if (b64Type == "image/bmp") { ext = "bmp"}
    if (b64Type == "image/svg+xml") { ext = "svg"}
    if (b64Type == "image/gif") { ext = "gif"}
    link.download = "converted_image." + ext;
}
