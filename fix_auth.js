const fs = require('fs');
let data = fs.readFileSync('frontend/src/context/AuthContext.jsx', 'utf8');

data = data.replace(
  "if (error.response?.status === 401) {",
  "const isAuthRoute = error.config?.url?.includes('/api/auth/login') || error.config?.url?.includes('/api/auth/register');\n        if (error.response?.status === 401 && !isAuthRoute) {"
);

fs.writeFileSync('frontend/src/context/AuthContext.jsx', data);
console.log("Fixed 401 redirect loop in AuthContext");
