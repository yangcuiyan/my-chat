const express = require("express");
const multer = require('multer')
const router = express.Router();
const uploadSingle = multer({
    dest: './public/file/'
})

const uploadImgSingle = multer({
    dest: './public/image/'
})
router.post('/file', uploadSingle.single('file'), function (req, res) {
    res.status(200).send({ path: req.file.path, status: 200 })
});

router.post('/image', uploadImgSingle.single('file'), function (req, res) {
    res.status(200).send({ path: req.file.path, status: 200 })
});
module.exports = router;