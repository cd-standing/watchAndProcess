//Import all modules
const chokidar = require('chokidar');// For file watching
const exec = require('child_process').exec// For external executable
const fs = require('fs');// For file system stuff
const path = require('path');// For reading files

// Read and parse JSON properties file
let rawdata = fs.readFileSync(path.resolve(__dirname, './properties/properties.json'));
let properties = JSON.parse(rawdata);
console.log(properties);

// Load and set global properties from JSON file
const inDir = properties.inDir// This is set to './processing/in'
const outDir = properties.outDir// This is set to './processing/out'
const stylesheet = properties.stylesheet

// Initialize watcher
console.log("Initialise the watcher...");
const watcher = chokidar.watch(inDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Watcher to check for added files and output the path to the file
watcher.on('add', path => {
  // Log out any added files
  console.log(`Watching ${inDir}`);
  console.log(`File ${path} has been added`);
  regex(path);
});

/*
Regex on the filepath can happen here to get the right components for a command.
In this case this is setting up a command for an XSL transform.
The command is passed into the 'process' function which will execute the command.
*/
const regex = (path) => {
  const filePath = path.replace(/\\/g, '/')
  const regex = /(.+)(\/)(.+)(\.xml)/
  const fileNoExt = filePath.toString().replace(regex, "$3")
  console.log(`This is the filename with no extension: ${fileNoExt}`)
  command = `xslt3 -s:${path} -xsl:${stylesheet} -o:${outDir}/${fileNoExt}.json`
  process(filePath, fileNoExt, command);
}
/* --------------------------------------- */

// Executes the process specified in the 'command' string.
const process = (filePath, fileNoExt, command) => {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }
    // the *entire* stdout and stderr (buffered)
    console.log(`-- stdout: ${stdout}`);
    console.log(`-- stderr: ${stderr}`);
    removeSrcFile(filePath, fileNoExt);
  });
}

// Remove any source files from the watch folder
const removeSrcFile = (filePath, fileNoExt) => {
  fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log(`File (${fileNoExt}) deleted from in_xml folder!`);
    })
}