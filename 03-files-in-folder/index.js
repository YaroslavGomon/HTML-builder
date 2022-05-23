const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      console.log('\nsecret-folder files:\n');

      let arr = [];
      files.map(val => (val.isFile() ? arr.push(val.name) : ''));

      for (let i of arr) {
        fs.stat(path.join(__dirname, 'secret-folder', i), (_, stats) => {
          console.log(i.replace('.', ' - ') + ' - ' + stats.size + ' bytes');
        });
      }
    }
  }
);
