const express = require('express');

const forgotController = require('../controllers/forgot');

const router = express.Router();

router.use("/forgotpassword", forgotController.forgotPassword);

module.exports = router;