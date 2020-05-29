const api = require('../controller/apiList')
const { getFileData } = require('../util/getBinFile')
const {  getRandomAvatar } = require('../util/getRandomAvatar')

describe('tests expression', function() {
    it('tests getExpression method', function() {
        api.getExpression('hh').should.be.fulfilled().then(function() {
        })
    })
})

describe('tests group', function() {
    it('tests getDefaultGroup method', function() {
        api.getDefaultGroup().should.be.fulfilled().then(function() {
        })
    })
})

describe('getFileData', function() {
    it('tests getFileData method', function(){
        getFileData('public/file/tests.txt')
    })
})