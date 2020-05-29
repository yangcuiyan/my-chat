const should = require('should')
const app = require('../app').app
const request = require('supertest').agent(app.listen())
const config = require('../config')

//测试验证码
describe('GET /getImageCode/captcha', function() {
    it('tests captcha and response with svg', function(done) {
        request.get('/getImageCode/captcha').expect(200, function(err, res) {
            if(err) done(err)
            res.body.should.be.type('object')
            done()
        })
    })
})
//测试用户注册
describe('POST /register', function() {
    it('tests user should not sign up when loginname or password is empty', function(done) {
        request.post('/register').send({
            username: '',
            password: '',
            ackPass: ''
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('用户名或密码不能为空')
            done()
        })
    })
    it('tests user should not sign up when password is not equal ackPass', function(done) {
        request.post('/register').send({
            username: 'kk',
            password: '123456',
            ackPass: '321555'
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('两次输入密码不一致')
            done()
        })
    })
    it('tests user should not sign up when captcha is not correct', function(done) {
        request.post('/register').send({
            username: 'kk',
            password: '123456',
            ackPass: '123456',
            vertifycode: 'a'
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('验证码不正确')
            done()
        })
    })
    // it('tests user sign up success', function(done) {
    //     request.post('/register').send({
    //         username: 'aaa',
    //         password: '123456',
    //         ackPass: '123456',
    //         vertifycode: config.captcha
    //     }).expect(200, function(err, res) {
    //         if(err) done(err)
    //         res.body.msg.should.containEql('注册成功！')
    //         done()
    //     })
    // })
    it('tests user should not sign up when username is exist', function(done) {
        request.post('/register').send({
            username: 'admin',
            password: '123456',
            ackPass: '123456',
            vertifycode: config.captcha
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('此用户名已存在')
            done()
        })
    })
})
//测试用户登录
describe('POST /login', function() {
    it('tests user should not sign in when username or password is empty', function(done) {
        request.post('/login').send({
            username: '',
            password: '',
            ackPass: ''
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('用户名或密码不能为空')
            done()
        })
    })
    it('tests user should not sign in when captcha is not correct', function(done) {
        request.post('/login').send({
            username: 'kk',
            password: '123456',
            ackPass: '123456',
            vertifycode: 'a'
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('验证码不正确')
            done()
        })
    })
    it('tests user sign in success', function(done) {
        request.post('/login').send({
            username: 'admin',
            password: '888888',
            ackPass: '888888',
            vertifycode: config.captcha
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('登陆成功')
            done()
        })
    })
    it('tests user should not sign in when username is not exist', function(done) {
        request.post('/login').send({
            username: 'a',
            password: '123456',
            ackPass: '123456',
            vertifycode: config.captcha
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('无效的用户名或密码')
            done()
        })
    })
    it('tests user should not sign in when password is not correct', function(done) {
        request.post('/login').send({
            username: 'admin',
            password: '123456',
            ackPass: '123456',
            vertifycode: config.captcha
        }).expect(200, function(err, res) {
            if(err) done(err)
            res.body.msg.should.containEql('无效的用户名或密码')
            done()
        })
    })
    it('tests user sign in by token', function(done) {
        request.post('/login').set('authorization', config.token).expect(200, function(err, res) {
            if(err) done(err)
            // res.body.msg.should.containEql('无效的用户名或密码')
            done()
        })
    })
})
//测试上传图片
describe('POST /upload/image', function() {
    it('tests upload image and response with json', function(done) {
        request.post('/upload/image').field('name', 'chat image')
            .attach('file', 'public/image/1.jpg').expect(200)
            .end(function(err, res) {
                if(err) done(err)
                res.body.should.be.type('object')
                done()
            })
    })
})
//测试上传文件
describe('POST /upload/file', function() {
    it('tests upload file and response with json', function(done) {
        request.post('/upload/file').field('name', 'chat file')
            .attach('file', 'public/file/tests.txt').expect(200)
            .end(function(err, res) {
                if(err) done(err)
                res.body.should.be.type('object')
                done()
            })
    })
})

