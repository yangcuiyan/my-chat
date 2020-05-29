const express = require("express");
const router = express.Router();
const controller = require("../controller/captcha")
router.get('/captcha', controller.captcha);
module.exports = router;
