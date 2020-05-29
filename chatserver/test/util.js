const muk = require('muk')


describe('getFileData', function() {
    var _readFile;
    before(function () {
        _readFile = fs.readFile;
        fs.readFile = function (filename, encoding, callback) {
            process.nextTick(function () {
                callback(new Error("mock readFile error"));
            });
        };
    });
    after(function () {
        // 用完之后记得还原。否则影响其他case
        fs.readFile = _readFile;
    })
})