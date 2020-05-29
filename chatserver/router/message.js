const express = require("express");
const router = express.Router();
const controller = require("../controller/message");
router.post('/getLinkmansLastMessages', controller.getLinkmansLastMessages);

module.exports = router;
