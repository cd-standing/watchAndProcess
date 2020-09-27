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
const stylesheet = properties.stylesheet// This is specifically for the xslt command

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
  createCommand(path);
});

/*
Regex on the filepath can happen here to get the right components for a command.
In this case this is setting up a command for an XSL transform.
The command is passed into the 'process' function which will execute the command.
*/
const createCommand = (path) => {
  const filePath = path.replace(/\\/g, '/')// Converts windows filepaths to unix
  // Regex to get the filename without extension
  const regex = /(.+)(\/)(.+)(\.)(.+)/
  const fileNoExt = filePath.toString().replace(regex, "$3")
  // ----------
  console.log(`This is the filename with no extension: ${fileNoExt}`)
  /* 
  Command to launch external executable. Begins with executable to be launched
  then arguments uncluding the filepath and filename can be passed in.
   */
  command = `xslt3 -s:${path} -xsl:${stylesheet} -o:${outDir}/${fileNoExt}.json`
  //Call the process function to execute the command
  process(filePath, fileNoExt, command);
}

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
 
    fs.readdir(inDir, function (err, files) {
      /*
      Check that the watched folder still has a file to delete.
      This could have been moved or already deleted depending on the
      process that was executed.
      */
      if (err) {
        // some sort of error
      } else {
        if (files.length) {
          // directory contains file/s
          removeSrcFile(filePath, fileNoExt);
        }
      }
    });
  });
}

// Remove any source files from the watch folder
const removeSrcFile = (filePath, fileNoExt) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log(`File (${fileNoExt}) deleted from in_xml folder!`);
  })
}