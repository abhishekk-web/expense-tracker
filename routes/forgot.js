const express = require('express');

const forgotController = require('../controllers/forgot');

const router = express.Router();

router.post("/forgotpassword", forgotController.forgotPassword);

module.exports = router;