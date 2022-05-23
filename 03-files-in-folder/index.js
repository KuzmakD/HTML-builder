const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');
const allFiles = fs.promises.readdir(secretFolder, {withFileTypes: true});

allFiles.then((files) => {
   files.forEach(file => {
      if (file.isFile()) {
         fs.stat(path.join(secretFolder, file.name), 
            (err, stats) => {
            if (err) throw err;
            const fileName = path.basename(file.name, `${path.extname(file.name)}`);
            const extFile = path.extname(file.name).slice(1);
            const sizeFile = (stats.size / 1024).toFixed(3);
            console.log(`${fileName} - ${extFile} - ${sizeFile}kb`);
         })
      }
   })
})
