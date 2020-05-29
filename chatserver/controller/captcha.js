const svgCaptcha = require("svg-captcha");
const config = require('../config')

const captcha = (req, res) => {
    const code = svgCaptcha.create({
        noise: 2,
        ignoreChars: '0o1i'
    });
    req.session.captcha = code.text.toLocaleLowerCase(); // session 存储
    config.captcha = req.session.captcha
    res.type('svg'); // 响应的类型
    res.status(200).send(code.data);
}

module.exports = {
    captcha
}
