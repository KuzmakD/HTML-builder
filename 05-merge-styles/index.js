const fs = require('fs');
const path = require('path');
const process = require('process');

const sourceName = path.join(__dirname, '/styles');
const targetName = path.join(__dirname, '/project-dist', '/bundle.css');
process.on('exit', () => console.log('Bundle.css was created!'));

const mergeFilesCSS = () => {
   fs.writeFile(targetName, '', (err) => {
      if (err) throw err;
   });

   fs.readdir(sourceName, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
         if (file.isFile() && path.extname(file.name) === '.css') {
            readFile(file.name).then(result => {
               fs.appendFile(targetName, result, (err) => {
                  if (err) throw err;
               });
            });
         }
      });
   });
};

async function readFile (file) {
   const chunks = [];
   const readableStream = fs.createReadStream(path.join(sourceName, `/${file}`), 'utf-8');
   for await (let chunk of readableStream) {
      chunks.push(chunk);
   }
   return chunks.toString();
}

mergeFilesCSS();
