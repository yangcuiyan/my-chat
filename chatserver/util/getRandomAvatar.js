const fs = require('fs');
const AvatarCount = 9
function getRandomAvatar () {
   const number = Math.floor(Math.random() * AvatarCount)
    return `./public/avatar/${number}.jpg`
}

function getAvatarData(path) {
    const data = fs.readFileSync(path);
    const base64 = 'data:/image/jpg;base64,' + data.toString('base64');
    return base64;
}
module.exports = {
    getRandomAvatar,
    getAvatarData
}
