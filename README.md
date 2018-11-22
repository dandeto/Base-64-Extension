# Base64 Encoder/Decoder Extension

### Description
This is a browser extension that encodes and decodes media to and from Base64. It was created to help developers who want
to use Base64 data strings instead of image or audio files. It is much faster and more convinient to use this extension rather than 
uploading your local files to a server for processing.

**Please note:**
1. This project is limited to converting media supported by the Base64 standard
2. Large files will take several seconds to process
3. This extension stores data in the following way:
	- It saves the last entered base64 string so the user does not need to re-enter it when the extension opens back up
	- The string is stored on the **user's computer** using the chrome.storage API

### Features
- Select a file from your computer and encode it to a Base 64 string
- Previews supported files
- Convert a Base 64 string to the correct file type
	- Download the file in any format

### Supported File Types
This extension supports converting the following file types (several examples listed):

- Images
	- png
	- jpeg
	- gif
	- bmp
	- tiff (can't be displayed)
	- ico
	- svg

- Audio
	- mpeg (mp3)
	- ogg
	- wav

- Text
	- txt
	- html
	- css
	- js
	- py
	- cpp
	- java

### Download
This extension is updated and availible on the [Chrome Store](https://chrome.google.com/webstore/detail/base64-encoderdecoder/afdannbjainhcddbjjlhamdgnojibeoi).
Alternatively you can download the latest source code [release](https://github.com/dandeto/Base-64-Extension/releases).

Availible on [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/base64-encoder-decoder/). I suggest you use Chrome instead for
now because Firefox has a bug that prematurely closes the popup window [bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1292701).

### Installation
If you downloaded the source and want to run it as an extension, you need to do the following:
```
1. Extract it from the .zip archive
2. Open Chrome
3. Go to chrome://extensions
4. Check the box "Developer mode"
5. Drag and drop the folder
6. You will see it in the top right corner of your brower window
```

### Found a Bug? Is there a file type I missed?
Please report it in the [issues](https://github.com/dandeto/Base-64-Extension/issues) section and give it a relevant tag.
