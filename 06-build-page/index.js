const fs = require('fs');
const path = require('path');

async function copyDir() {
  const src = path.join(__dirname, 'assets');
  const dest = path.join(__dirname, 'project-dist', 'assets');

  await fs.promises.mkdir(dest, { recursive: true }, () => {});
  fs.readdir(dest, { withFileTypes: true }, (err, files) => {
    for (let i of files) {
      fs.unlink(path.join(dest, i.name), () => {});
    }
  });

  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    let names = [];
    files.map(val => names.push(val.name));

    for (let i of files) {
      if (i.isDirectory()) {
        fs.mkdir(path.join(dest, i.name), { recursive: true }, () => {});
        fs.readdir(
          path.join(src, i.name), { withFileTypes: true }, async (err, files) => {
            let names2 = [];
            files.map(val => names2.push(val.name));
            for (let j of names2) {
              fs.copyFile(path.join(src, i.name, j), path.join(dest, i.name, j), () => {});
            }
          }
        );
      }
    }
  });
}

const createStylesBundle = function () {
  const src = path.join(__dirname, 'styles');
  const dest = path.join(__dirname, 'project-dist');

  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    let data = '';
    let stream;

    for (let val of files) {
      if (val.name.slice(val.name.lastIndexOf('.') + 1) === 'css') {
        stream = fs.createReadStream(path.join(src, val.name), 'utf-8');
        stream.on('data', chunk => (data += chunk));
      }
    }

    const output = fs.createWriteStream(path.join(dest, 'style.css'));
    stream.on('end', () => output.write(data));
  });
};

const createHtml = function () {
  const src = path.join(__dirname);
  const components = path.join(__dirname, 'components');
  const dest = path.join(__dirname, 'project-dist');

  fs.readdir(components, { withFileTypes: true }, (err, files) => {
    const data = {};
    let stream;

    for (let val of files) {
      let componentName = val.name.slice(0, val.name.lastIndexOf('.'));
      if (val.name.slice(val.name.lastIndexOf('.') + 1) === 'html') {
        stream = fs.createReadStream(path.join(components, val.name), 'utf-8');
        stream.on('data', chunk => (data[componentName] = chunk));
      }
    }

    stream.on('end', () => {
      fs.readdir(src, { withFileTypes: true }, (err, files) => {
        let htmlBundle = '';
        let stream2;

        for (let val of files) {
          if (val.name.slice(val.name.lastIndexOf('.') + 1) === 'html') {
            stream2 = fs.createReadStream(path.join(src, val.name), 'utf-8');
            stream2.on('data', chunk => (htmlBundle += chunk));
          }
        }

        const output = fs.createWriteStream(path.join(dest, 'index.html'));

        stream2.on('end', () => {
          const partsNames = Object.keys(data);
          for (let val of partsNames) {
            htmlBundle = htmlBundle.replace(`{{${val}}}`, data[val]);
          }

          output.write(htmlBundle);
        });
      });
    });
  });
};

copyDir();
createStylesBundle();
createHtml();
