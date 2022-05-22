const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const { Stream } = require('stream');

const output = fs.createWriteStream(path.join(__dirname, 'notes.txt'));

stdout.write('Input your text: \n');
stdin.on('data', data => {
   if (!data.toString().includes('exit')) {
      output.write(data);
   } else {
      stdout.write('Good bye, my dear friend!');
      process.exit();
   }
});
process.on('SIGINT', () => {
   stdout.write('Good bye, my dear friend!');
   process.exit();
});