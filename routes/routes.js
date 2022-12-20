const dataRoutes = require('../controllers/controllers');
const userController = require('../controllers/user');

const express = require('express');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/data', dataRoutes.postAddData);

router.get('/getdata', dataRoutes.getData);

router.post('/datas', dataRoutes.datasPost);

router.delete('/deletedata/:id', dataRoutes.deletePost)

module.exports = router;