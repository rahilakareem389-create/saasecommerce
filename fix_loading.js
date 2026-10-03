const fs = require('fs');
let data = fs.readFileSync('frontend/src/pages/StoreFront.jsx', 'utf8');

data = data.replace(
  "setLoading(false);\n      }).catch(console.error);",
  "setLoading(false);\n      }).catch(err => { console.error(err); setLoading(false); });"
);

fs.writeFileSync('frontend/src/pages/StoreFront.jsx', data);
console.log("Fixed StoreFront loading bug");
