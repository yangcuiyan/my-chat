// const users = require("./model/users");
// let temp;
// async function tests() {
//     temp = await users.find(function(err, res) {
//         console.log(res);
//         console.log(resolve)
//     });
//     console.log('a',  temp.constructor )
// }
// tests()
// console.log('b')

const reg = /^(.*){1,30}$/
console.log(reg.test("这个人很懒，暂时没有签名哦！"))

const {env} = process
console.log(env)



