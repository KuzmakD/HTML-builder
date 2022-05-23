const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const process = require('process');

const projectDir = path.join(__dirname, '/project-dist');
process.on('exit', () => console.log('Task done!'));

async function build() {
   await makeDir(projectDir).then(() => {
      const assets = path.join(projectDir, '/assets');

      makeDir(assets).then(() => {
         const fonts = path.join(assets, '/fonts');
         const img = path.join(assets, '/img');
         const svg = path.join(assets, '/svg');
         makeDir(fonts).then(() => {
            copyDir(path.join(__dirname, '/assets/fonts'), fonts);
         });
         makeDir(img).then(() => {
            copyDir(path.join(__dirname, '/assets/img'), img);
         });
         makeDir(svg).then(() => {
            copyDir(path.join(__dirname, '/assets/svg'), svg);
         });
      });
   }).then(() => {
      createHTMLFile();
   }).then(() => {
      createCSSFile();
   });
}

async function makeDir(dir) {
   try {
      await fsp.rm(dir, { recursive: true }, (err) => {
         console.log(`${dir} deleted`);
      })
   } catch (err) {
      console.log(`${dir} does not exist for delete`);
   }
   try {
      await fsp.mkdir(dir, { recursive: true }, (err) => {
         console.log(`${dir} created`);
      })
   } catch (err) {
      console.log(`Unable to create directory ${dir}`);
   }
}

async function copyDir(sourceDir, targetDir) {
   const files = await fsp.readdir(sourceDir, { withFileTypes: true });
   files.forEach((file) => {
      if (file.isFile()) {
         copyFile(sourceDir, targetDir, file.name);
      }
   });
}

async function copyFile(sourceDir, targetDir, file) {
   try {
      await fsp.copyFile(path.join(sourceDir, `/${file}`), path.join(targetDir, `/${file}`));
      console.log(`${sourceDir}${file} => copied to =>  ${targetDir}${file}`);
   } catch (err) {
      console.log(err);
   }
}

async function readFile(file) {
   const chunks = [];
   const readStream = fs.ReadStream(file);
   for await (const chunk of readStream) {
      chunks.push(chunk);
   }
   return chunks.toString().trim();
}

async function createHTMLFile() {
   let template = await readFile(path.join(__dirname, 'template.html'));
   const componentsPath = path.join(__dirname, '/components');
   const files = await fsp.readdir(componentsPath, { withFileTypes: true });
    
   for (let file of files) {
      console.log(file.name)
      if (file.isFile() && path.extname(file.name) === '.html') {
         const content = await readFile(path.join(componentsPath, `/${file.name}`));
         const fileName = path.basename(file.name, path.extname(file.name));
         template = template.replace(`{{${fileName}}}`, `${content}`);
      }
   }

   await fsp.writeFile(path.join(projectDir, '/index.html'), `${template}`, { flag: 'w' }, error => {
      if (error) throw error;
   });
}

async function createCSSFile() {
   const stylesPath = path.join(__dirname, '/styles');
   const files = await fsp.readdir(stylesPath, { withFileTypes: true });
   for (let file of files) {
      console.log(file.name)
      if (file.isFile() && path.extname(file.name) === '.css') {
         const css = await readFile(path.join(stylesPath, `/${file.name}`));
         fsp.appendFile(path.join(projectDir, '/style.css'), css, { flag: 'a' }, err => {
            if (err) throw err;
         });
      }
   }
}

build();

