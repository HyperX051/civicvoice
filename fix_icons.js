const fs = require('fs');
let content = fs.readFileSync('frontend/www/js/icons.js', 'utf8');
content = content.replace(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 256 256">/g, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="1em" height="1em">');
content = content.replace(/<rect width="1em" height="1em" fill="none"\/>/g, '<rect width="256" height="256" fill="none"/>');
fs.writeFileSync('frontend/www/js/icons.js', content);
console.log('Fixed icons.js');
