const dataRoutes = require('../controllers/controllers');
const userController = require('../controllers/user');
const userauthentication = require('../middleware/auth');

const express = require('express');

const router = express.Router();

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/data', userauthentication.authenticate , dataRoutes.postAddData);

router.get('/getdata', userauthentication.authenticate , dataRoutes.getData);

router.post('/datas', dataRoutes.datasPost);

router.delete('/deletedata/:id', userauthentication.authenticate , dataRoutes.deletePost)

module.exports = router;