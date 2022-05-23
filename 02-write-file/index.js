const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('\nВведите цифробуквы:\n');
stdin.on('data', chunk => {
  let text = chunk.toString();
  if (text.trim() == 'exit') {
    process.exit();
  }
  output.write(text);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => stdout.write('\nПока!\n'));
