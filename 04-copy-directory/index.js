const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

const copyDir = function () {
  fs.mkdir(dest, { recursive: true }, () => {});
  fs.readdir(dest, { withFileTypes: true }, (err, files) => {
    for (let i of files) {
      fs.unlink(path.join(dest, i.name), () => {});
    }
  });
  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    let names = [];
    files.map(val => names.push(val.name));
    for (let i of names) {
      fs.copyFile(path.join(src, i), path.join(dest, i), () => {});
    }
  });
};

copyDir();
