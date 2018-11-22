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
var file_type = document.getElementById("file_type");
var state, string,
img, aud, fr, file, type, b64Type, created, fileType;
var setting = 0;
var ctx = canvas.getContext("2d");

to.addEventListener('click', function(event) {
  setting = 0;
  tobtn.style.display = "none";
  copybtn.style.display = "inline";
  download.style.display = "none";
  clear.style.display = "none";
  selector.style.display = "none";
  label.style.display = "inline-block";
  fileName.style.display = "inline-block";
  file_type.style.display = "none";

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
  file_type.style.display = "inline-block";
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

input.addEventListener("change", convert);
tobtn.addEventListener("click", find);

function convert() {
  document.getElementById("fileName").textContent = input.files[0].name;
  setting = 0;
  file = input.files[0];
  fr = new FileReader();
  var containsAudio = file.type.indexOf("audio");
  var containsVideo = file.type.indexOf("video");
  var containsImage = file.type.indexOf("image");
  var containsText = file.type.indexOf("text");
  if (containsAudio == 0) { //if audio
    fr.onload = createAudio;
    fileType = "audio";
  } else if (containsVideo == 0) { //if video
    fr.onload = createAudio;
    fileType = "audio";
  } else if (containsImage == 0) { // if image
    fr.onload = createImage;
    fileType = "image";
  } else if (containsText == 0) { // if txt
    fr.onload = createText; // onload fires after reading is complete
    fileType = "text";
  } else {
    alert("File not supported.");
    fr.onload = createDefault;
  }
  fr.readAsDataURL(file);
}

function find() {
  if (out.value.indexOf("text/") > -1) {//all text
    createText();
    fileType = "text";
  }
  if (out.value.indexOf("image/") > -1) { //all image types
    createImage();
    fileType = "image";
  }
  if (out.value.indexOf("audio/") > -1 ||
      out.value.indexOf("video/ogg") > -1) { //all audio
    createAudio();
    fileType = "audio";
  }
}

function clearDisplay() {
	if (created == "audio") {
  	var el = document.getElementsByTagName("audio")[0];
    document.getElementById("cnvContainer").removeChild(el);
  } else if (created == "text") {
  	var el = document.getElementsByTagName("textarea")[0];
  	document.getElementById("cnvContainer").removeChild(el);
  } else {
  	ctx.clearRect(0,0,canvas.width,canvas.height); //clean up canvas
  	canvas.width = 0;
  	canvas.height = 0;
  }
   created = "";
}

function createImage() {
  clearDisplay();
  img = new Image();
  img.onload = imageLoaded; //create canvas and put img on it
  if (setting == 0) {
    img.src = fr.result;
    out.value = fr.result;
    store(fr.result);
  }
  if (setting == 1) {
    if (state == -1) {
      out.value = string + out.value;
      img.src = out.value;
    } else {
      img.src = out.value;
    }
    store(out.value);
  }
}

function imageLoaded() {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img,0,0);
}

function createAudio() {
  clearDisplay();
  aud = document.createElement("audio");
  if (setting == 0) {
    aud.setAttribute("src",fr.result); //make uploaded file the audio
    out.value = aud.src;
    store(fr.result);
  }
  if (setting == 1) {
    var contains = out.value.indexOf("data:audio/mp3;base64,"); //Chrome says mp3 instead of mpeg like FF but FF accepts both
    if (state == -1 && contains == 0) {
      aud.setAttribute("src",out.value);
    } else if (state == -1 && contains == -1) {
      out.value = string + out.value;
      aud.setAttribute("src",out.value);
    } else {
      aud.setAttribute("src",out.value);
    }
    store(out.value);
  }

  aud.setAttribute("controls", "controls");
  document.getElementById("cnvContainer").appendChild(aud);
  created = "audio";
}

function createText() {
	clearDisplay();
	var txt = document.createElement("textarea");
  txt.setAttribute("rows", "5");
	function detect() {
		var contains = out.value.indexOf("data:text");
  	if (contains == -1) {
  		txt.value = window.atob(out.value);
  	} else if (contains == 0) {
  		var str = out.value.split(",").pop();
  		txt.value = window.atob(str);
    }
    store(out.value);
	}
	if (setting == 0) {
  	out.value = fr.result;
    store(fr.result);
  }
  detect();
  document.getElementById("cnvContainer").appendChild(txt);
  created = "text";
}

function createDefault() {
  clearDisplay();
  out.value = window.btoa(fr.result);
}

function downloadCanvas(link) {
  var ext;
  file_type = document.getElementById("file_type");
  if (file_type.value.indexOf(".") == 0) {
    ext = file_type.value;
  } else {
    ext = "." + file_type.value;
  }

  if (file_type.value == undefined || file_type.value == "") {
    if (b64Type == "image/png") { ext = ".png"}
    if (b64Type == "image/jpeg") { ext = ".jpg"}
    if (b64Type == "image/bmp") { ext = ".bmp"}
    if (b64Type == "image/svg+xml") { ext = ".svg"}
    if (b64Type == "image/gif") { ext = ".gif"}
    if (b64Type == "image/tiff") { ext = ".tiff"}
    if (b64Type == "image/x-icon") { ext = ".ico"}
    if (b64Type == "audio/mpeg") { ext = ".mp3"}
    if (b64Type == "audio/wav") { ext = ".wav"}
    if (b64Type == "video/ogg") { ext = ".ogg"}
    if (b64Type == "text/plain") { ext = ".txt"}
    if (b64Type == "text/css") { ext = ".css"}
    if (b64Type == "text/html") { ext = ".html"}
    if (b64Type == "text/javascript") { ext = ".js"}
  }
console.log(ext)
  if (ext == undefined || ext == "") { //needs to select download format
    alert("Select a file type.");
  } else {
    link.download = "converted_file" + ext;
    link.href = out.value;
  }
}

(function () {
  chrome.storage.local.get(['key'], function(result) {
    if (result.key !== undefined) {
      out.value = result.key;
      setting = 1;
      find();
    }
  });

}());

function store(data) {
  chrome.storage.local.set({"key": data});
}
