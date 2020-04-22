var out           = document.getElementById("output"), //all global because its UI
    copybtn       = document.getElementById("copy"),
    to64          = document.getElementById("to"),
    from64        = document.getElementById("from"),
    tobtn         = document.getElementById("convert"),
    input         = document.getElementById("file"),
    canvas        = document.getElementById("cnv"),
    download      = document.getElementById("download"),
    clear         = document.getElementById("clear"),
    label         = document.getElementById("label"),
    fileName      = document.getElementById("fileName"),
    file_type     = document.getElementById("file_type"),
    cnv_container = document.getElementById("cnvContainer"),
    string_input  = document.getElementById("string-input"),
    created,
    setting = 0,
    ctx = canvas.getContext("2d");

to.style.borderColor = "#00a9ff";

to.addEventListener('click', () => {
  setting = 0;
  document.querySelector("#to-container").style.display   = "block";
  document.querySelector("#from-container").style.display = "none";
  to.style.borderColor     = "#00a9ff";
  from64.style.borderColor = "";

});
from64.addEventListener('click', () => {
  setting = 1;
  document.querySelector("#to-container").style.display   = "none";
  document.querySelector("#from-container").style.display = "block";
  from64.style.borderColor = "#00a9ff";
  to.style.borderColor     = "";
});

copybtn.addEventListener('click', () => {
  out.select();
  document.execCommand('copy');
});

clear       .addEventListener('click', () => { out.value = null; });
download    .addEventListener('click', function() { downloadCanvas(this); });
input       .addEventListener("change", convert);
tobtn       .addEventListener("click", find);
string_input.addEventListener('keyup',  e => convertText(e)); //when typing
string_input.addEventListener('change', e => convertText(e)); //for pasting in text
document.getElementById("clear-storage").addEventListener('click', () => { chrome.storage.local.clear(); });

function convertText(e) {
  if (!setting) out.value = window.btoa(e.target.value);
  else          out.value = window.atob(e.target.value);
  store(out.value);
}

function convert() {
  clearDisplay();
  document.getElementById("fileName").textContent = input.files[0].name;
  let file = input.files[0];
  let fr = new FileReader();
  if (file.type.indexOf("audio") == 0 || file.type.indexOf("video") == 0) fr.onload = createAudio;
  else if (file.type.indexOf("image") == 0)                               fr.onload = createImage;
  else if (file.type.indexOf("text") == 0)                                fr.onload = createText;
  else                                                                    fr.onload = createDefault;
  fr.readAsDataURL(file);
}

function find() {
  clearDisplay();
  if (out.value.indexOf("text/") > -1)            createText();
  else if (out.value.indexOf("image/") > -1)      createImage();
  else if (out.value.indexOf("audio/") > -1 ||
           out.value.indexOf("video/ogg") > -1)   createAudio();
  else                                            alert("No supported base64 header.");
}

function clearDisplay() {
	if (created == "audio")
    cnv_container.removeChild(document.getElementsByTagName("audio")[0]);
  else if (created == "text")
  	cnv_container.removeChild(document.getElementsByTagName("textarea")[0]);
  else {
  	ctx.clearRect(0,0,canvas.width,canvas.height); //clean up canvas
  	canvas.width = 0;
  	canvas.height = 0;
  }
   created = "";
}

function createImage() {
  console.log(this);
  let img = new Image();
  img.onload = () => { //create canvas and put img on it
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img,0,0);
  };

  if (setting == 0) {
    img.src = this.result;
    out.value = this.result;
  } else if (setting == 1)
    img.src = out.value;
  store(out.value);
}

function createAudio() {
  aud = document.createElement("audio");
  if (setting == 0) {
    aud.setAttribute("src",this.result); //make uploaded file the audio
    out.value = this.result;
  } else if (setting == 1)
    aud.setAttribute("src",out.value);

  store(out.value);
  aud.setAttribute("controls", "controls");
  cnv_container.appendChild(aud);
  created = "audio";
}

function createText() {
	var txt = document.createElement("textarea");
  txt.setAttribute("rows", "5");
	if (setting == 0) out.value = this.result;
  txt.value = window.atob(out.value.split(",").pop());
  store(out.value);
  cnv_container.appendChild(txt);
  created = "text";
}

function createDefault() { //not a supported type. Do the conversion, but leave off header
  alert("File not supported.");
  out.value = window.btoa(this.result);
}

function downloadCanvas(link) {
  let ext;
  file_type = document.getElementById("file_type"); //update the current value


  if (file_type.value == undefined || file_type.value == '') {
    let b64Type = document.getElementById("fileTypeSelector").value;
    if (b64Type == "image/png")            ext = ".png";
    else if (b64Type == "image/jpeg")      ext = ".jpg";
    else if (b64Type == "image/bmp")       ext = ".bmp";
    else if (b64Type == "image/svg+xml")   ext = ".svg";
    else if (b64Type == "image/gif")       ext = ".gif";
    else if (b64Type == "image/tiff")      ext = ".tiff";
    else if (b64Type == "image/x-icon")    ext = ".ico";
    else if (b64Type == "audio/mpeg")      ext = ".mp3";
    else if (b64Type == "audio/wav")       ext = ".wav";
    else if (b64Type == "video/ogg")       ext = ".ogg";
    else if (b64Type == "text/plain")      ext = ".txt";
    else if (b64Type == "text/css")        ext = ".css";
    else if (b64Type == "text/html")       ext = ".html";
    else if (b64Type == "text/javascript") ext = ".js";
  } else {
    if (file_type.value.indexOf(".") == 0) ext = file_type.value;
    else                                   ext = "." + file_type.value;
  }

  if (ext == undefined || ext == '') alert("Select a file type.");
  else if (!(out.value == undefined || out.value == "")) {
    link.download = "converted_file" + ext;
    link.href = out.value;
  } else alert("Nothing to download!");
}

function store(data)
  { chrome.storage.local.set({"key": data}); }

(function () {
  chrome.storage.local.get(['key'], function(result) {
    if (result.key !== undefined) {
      function load() {
        out.value = result.key;
        setting = 1;
        find();
        setting = 0;
      }

      function confirmBox(callback) {
        var confirmDialogue = document.querySelector(".confirm");
        confirmDialogue.style.display = "block";
        confirmDialogue.children[1].addEventListener('click', () => {
          confirmDialogue.style.display = "none";
          callback();
        });
        confirmDialogue.children[2].addEventListener('click', () => { confirmDialogue.style.display = "none" });
      }
      //ask to load what's in ls
      if (result.key.length < 500000) load(); //smallish file, don't worry about it.
      else confirmBox(load); //will take awhile to load
    }
  });
}());
