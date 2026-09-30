import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.css') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let count = 0;

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  // old teal rgb: 13, 92, 99
  // new red rgb: 120, 0, 1
  const replaced = content.replace(/13\s*,\s*92\s*,\s*99/g, '120, 0, 1');
  if (content !== replaced) {
    fs.writeFileSync(file, replaced);
    count++;
  }
});

console.log(`Replaced in ${count} files.`);
