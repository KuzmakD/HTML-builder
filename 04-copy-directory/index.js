const fs = require('fs');
const path = require('path');
const process = require('process');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'copy-files');

fs.rm(targetDir, { recursive: true, force: true }, (err) => {
   if (err) throw err;
   makeDir();
});

const makeDir = () => {
   fs.mkdir(targetDir, { recursive: true }, (err) => {
      if (err) throw err;
      copyFiles();
   });
}

const copyFiles = () => {
   fs.readdir(sourceDir, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
         fs.copyFile(path.join(sourceDir, `/${file.name}`),
            path.join(targetDir, `/${file.name}`),
            (err) => {
               if (err) throw err;
            });
      })
   });
}





