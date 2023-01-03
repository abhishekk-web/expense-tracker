const express = require('express');

const forgotController = require('../controllers/forgot');

const router = express.Router();

router.get('/resetpassword/:id', forgotController.resetpassword)

router.get('/updatepassword/:resetpasswordid', forgotController.updatepassword)

router.use("/forgotpassword", forgotController.forgotPassword);

module.exports = router;