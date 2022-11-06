const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist');

const createStylesBundle = function () {

  fs.readdir(src, { withFileTypes: true }, (err, files) => {

    let data = '';
    let stream;

    for (let val of files) {
      if (val.name.slice(val.name.lastIndexOf('.') + 1) === 'css') {
        stream = fs.createReadStream(path.join(src, val.name), 'utf-8');
        stream.on('data', chunk => (data += chunk));
      }
    }

    const output = fs.createWriteStream(path.join(dest, 'bundle.css'));
    stream.on('end', () => output.write(data));

  });
  
};

createStylesBundle();
