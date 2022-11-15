const dataRoutes = require('../controllers/controllers');

const express = require('express');

const router = express.Router();

router.post('/data', dataRoutes.postAddData);

router.get('/getdata', dataRoutes.getData);

router.delete('/deletedata/:id', dataRoutes.deletePost)

module.exports = router;