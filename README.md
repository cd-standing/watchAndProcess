# watch and process
Simple process which watches a folder then processes any added files.

## Overview

This is a simple task written in NodeJS that watches a folder for any added files. When this is running, any file added to the watched folder will be picked up by the process. The result will be he filepath of the file being passed to the process.
An additional process to create a command then execute an external application are used to then process the file.
Finally, the source file is deleted from the watched folder so that the process doesn't continually process the same file.

### Prerequisites

- NodeJS: https://nodejs.org/en/download/
- npm (this is installed with NodeJS)

### Setup

- Clone the repo (follow instructions on GitHub)
- From the 'watcher' folder type `npm install`

### Usage

_Note:  This particular package is set up to watch for XML files then transform using XSLT and SaxonJS. The code can easily be modified to launch any executable_ and process any files.

`node watch`

This will start the watcher and wait for a file to be added to the watched folder `./processing/in`.

Add any of the test files from `./test_files` to the `./processing/in' folder to start the process. Multiple files can also be processed at once.


### Modifying

#### Change the watched folder

The watched folder is specified in `./properties/properties.json` as the value of `inDir`. Change the value of `inDir` to the path of your preferred wathed folder.

#### Change the command for the executable

If you wish to process another type of file and launch another executable you can do this in the `createCommand` function.

For example, the existing command

command = `xslt3 -s:${path} -xsl:${stylesheet} -o:${outDir}/${fileNoExt}.json`

could be a simple command to move and rename a file from one folder to another

command = `move ${path} ${outDir}/${fileNoExt}-moved.txt`
