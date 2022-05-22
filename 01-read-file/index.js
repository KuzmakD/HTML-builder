const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const { Stream } = require('stream');

const readableStream = fs.createReadStream(
   path.join(__dirname, 'text.txt'), 'utf-8');

readableStream.on('data', data => stdout.write(data));

// or  readableStream.on('data', chunk => console.log(chunk));

// fs.readFile(
//    path.join(__dirname, 'text.txt'),
//    'utf-8',
//    (err, data) => { 
//       if (err) throw err;
//       console.log(data);
//    }
// );
