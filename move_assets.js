const fs = require('fs');
const path = require('path');

const src = 'c:\\Users\\ASUS\\Desktop\\Personal\\projects\\Personal Portfolio\\Portfolio\\src\\assets\\Mockups';
const dst = 'c:\\Users\\ASUS\\Desktop\\Personal\\projects\\Personal Portfolio\\Portfolio\\public\\Mockups';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  }
}

if (fs.existsSync(src)) {
  copyRecursiveSync(src, dst);
  console.log('Finished moving files');
} else {
  console.log('Source not found');
}
