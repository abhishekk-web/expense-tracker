const express = require('express');

const premiumFeauture = require('../controllers/premiumFeature');

const authenticatemiddleware = require("../middleware/auth");

const router = express.Router();

router.get('/showLeaderBoard', authenticatemiddleware.authenticate, premiumFeauture.getUserLeaderBoard);

module.exports = router;
