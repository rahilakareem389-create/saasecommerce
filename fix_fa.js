const fs = require('fs');
let data = fs.readFileSync('frontend/index.html', 'utf8');

if (!data.includes('font-awesome')) {
  data = data.replace('</title>', '</title>\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">');
  fs.writeFileSync('frontend/index.html', data);
  console.log("Added FontAwesome to index.html");
} else {
  console.log("FontAwesome already present");
}
