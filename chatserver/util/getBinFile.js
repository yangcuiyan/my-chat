const fs = require('fs');

function getFileData(path) {
    const data = fs.readFileSync(path);
    return data;
}
module.exports = {
    getFileData
}
