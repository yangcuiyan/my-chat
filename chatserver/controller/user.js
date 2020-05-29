const userDao = require("../dao/user");

const login = async (req, res) => {
    const params = req.body;
    const captcha = req.session.captcha;
    const token = req.headers.authorization;
    let result = null;
    if(token && token !== 'undefined' && token !== '') {
        result = await userDao.loginByToken(token)
        res.status(200).send(result);
        return false
    } else if (params) {
        for (const prop in params) {
            if (!params[prop]) {
                res.status(200).send({msg: '用户名或密码不能为空', status: 400})
                return false
            }
        }
        if (params.vertifycode && params.vertifycode !== captcha) {
            res.status(200).send({msg: '验证码不正确', status: '400'})
            return false
        } else {
            result = await userDao.loginByNameAndPass(params)
            res.status(200).send(result);
            return false
        }
    }
    res.status(200).send({msg: '非法token', status: '400'})
}

const register = async (req, res) => {
    const params = req.body;
    const captcha = req.session.captcha;
    let result = null;
    for (const prop in params) {
        if (!params[prop]) {
            res.status(200).send({msg: '用户名或密码不能为空', status: 400})
            return
        }
    }
    if(params.password !== params.ackPass) {
        res.status(200).send({msg: '两次输入密码不一致', status: 400})
        return
    } else if (params.vertifycode !== captcha) {
        res.status(200).send({msg: '验证码不正确', status: '400'})
        return
    } else {
        result = await userDao.register(params)
        res.status(200).send(result)
    }
}

function searchFriend(data) {
    return userDao.searchFriend(data)
}

module.exports = {
    login,
    register,
    searchFriend
}
