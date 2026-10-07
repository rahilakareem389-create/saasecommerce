const fs = require('fs');
const path = require('path');

const directory = 'f:/internship/New folder (2)/ecommerce/frontend/src';

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let newContent = content.replace(/'http:\/\/localhost:5000'/g, "(`http://${window.location.hostname}:5000`)");
            newContent = newContent.replace(/"http:\/\/localhost:5000"/g, "(`http://${window.location.hostname}:5000`)");
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf-8');
                console.log('Updated', fullPath);
            }
        }
    });
}

walkDir(directory);
