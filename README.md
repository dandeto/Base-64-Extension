# Base64 Encoder/Decoder Extension

### Description
This is a browser extension that encodes and decodes media to and from Base64. It was created to help developers who want
to use Base64 data strings instead of image or audio files. It is much faster and more convinient to use this extension rather than 
uploading your local files to a server.

**Please note:**
1. This project is limited to converting media supported by the Base64 standard
2. Large files will take several seconds to process.
3. This extension does not store any of your data for any reason.

### Features
- Select a file from your computer and encode it to a Base 64 string
- Convert a Base 64 string to the correct file type
	- Download the file

### Supported File Types
This extension supports converting the following file types:

- Images
	- png
	- jpeg
	- gif
	- bmp
	- tiff (can't be displayed)
	- ico
	- svg

- Audio
	- mpeg mp3
	- ogg

### Download
This extension is updated and availible on the [Chrome Store](#).
Alternatively you can download the latest source code [release](https://github.com/dandeto/Base-64-Extension/releases).
That said, Chrome will prompt you to disable it every time you open the browser, so I highly advise downloading it from the store.

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
