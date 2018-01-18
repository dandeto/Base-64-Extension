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
var label = document.getElementById("label");
var fileName = document.getElementById("fileName");
var state, string;
var img, aud, fr, file, type, b64Type, created, fileType;
var setting = 0;
var ctx = canvas.getContext("2d");
var containsAudio, containsVideo, containsImage;

to.addEventListener('click', function(event) {
  setting = 0;
  tobtn.style.display = "none";
  copybtn.style.display = "inline";
  download.style.display = "none";
  clear.style.display = "none";
  selector.style.display = "none";
  label.style.display = "inline-block";
  fileName.style.display = "inline-block";

});
from64.addEventListener('click', function(event) {
  setting = 1;
  tobtn.style.display = "inline";
  copybtn.style.display = "none";
  download.style.display = "inline-block";
  clear.style.display = "inline";
  selector.style.display = "inline";
  label.style.display = "none";
  fileName.style.display = "none";
});
clear.addEventListener('click', function(event) {
  out.value = null;
});
selector.addEventListener('change', function(event) {
  b64Type = this.value;
});
copybtn.addEventListener('click', function(event) {
  out.select();
  document.execCommand('copy');
});

download.addEventListener('click', function() {
    downloadCanvas(this);
}, false);

input.addEventListener("change", detect);
tobtn.addEventListener("click", find);

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
    containsAudio = file.type.indexOf("audio");
    containsVideo = file.type.indexOf("video");
    containsImage = file.type.indexOf("image");
    if (containsAudio == 0) { //if audio
      fr.onload = createAudio;
      fileType = "audio";
    } else if (containsVideo == 0) { //if audio
      fr.onload = createAudio;
      fileType = "audio";
    }
    else if (containsImage == 0) { // if image
      fr.onload = createImage;   // onload fires after reading is complete
      fileType = "image";
    }
    else{
      alert("file not supported");
    }
    fr.readAsDataURL(file);
  }
}

function find() {
  if (b64Type == undefined) {
    alert("Select a media type.");
  }
  string = "data:" + b64Type + ";base64,";
  state = out.value.indexOf(string);
  var contains = b64Type.indexOf("image");
  if (contains == 0) {
    createImage();
    fileType = "image";
  }
  if (contains == -1) {
    createAudio();
    fileType = "audio";
  }
}

function clearCanvas() {
  ctx.clearRect(0,0,canvas.width,canvas.height); //clean up canvas
  canvas.width = 0;
  canvas.height = 0;
}

function createImage() {
  img = new Image();
  img.onload = imageLoaded; //create canvas and put img on it
  if (setting == 0) {
    img.src = fr.result;
  }
  if (setting == 1) {
    if (b64Type == undefined || b64Type == "media type") {
      alert("Select a media type.");
    } else if (state == -1) {
      out.value = string + out.value;
      img.src = out.value;
    } else {
      img.src = out.value;
    }
  }
}

function createAudio() {
  clearCanvas();
  aud = document.createElement("audio");
  if (created) {
    var el = document.getElementsByTagName("audio")[0];
    document.getElementById("cnvContainer").removeChild(el);
  }
  if (setting == 0) {
    aud.setAttribute("src",fr.result); //make uploaded file the audio
    out.value = aud.src;
  }
  if (setting == 1) {
    if (b64Type == undefined || b64Type == "media type") {
      alert("Select a media type.");
    } else if (state == -1) {
      out.value = string + out.value;
      aud.setAttribute("src",out.value);
    } else {
      aud.setAttribute("src",out.value);
    }
  }

  aud.setAttribute("controls", "controls");
  document.getElementById("cnvContainer").appendChild(aud);
  created = true;
}

function imageLoaded() {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img,0,0);
  if (setting == 0) {
    out.value = img.src;
  }
}

function downloadCanvas(link) {
  if (fileType == "image") {link.href = img.src;}
  if (fileType == "audio") {link.href = aud.src;}
    var ext;
    if (b64Type == "image/png") { ext = "png"}
    if (b64Type == "image/jpeg") { ext = "jpg"}
    if (b64Type == "image/bmp") { ext = "bmp"}
    if (b64Type == "image/svg+xml") { ext = "svg"}
    if (b64Type == "image/gif") { ext = "gif"}
    if (b64Type == "audio/mpeg") { ext = "mp3"}
    if (b64Type == "video/ogg") { ext = "ogg"}
    link.download = "converted_file." + ext;
}
