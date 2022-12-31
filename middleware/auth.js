const jwt = require('jsonwebtoken');
const User = require("../models/users");
const purchase = require("../controllers/purchase");
const premium = require('../controllers/premiumFeature');

exports.authenticate = (req, res, next) => {
    // authorization
    try {
        const token = req.header('Authorization');
        console.log("token is ",token);
        const user = jwt.verify(token, 'secrets');
        console.log('user id is ',user.userId);
        User.findByPk(user.userId).then((user) => {
            
            req.user = user;
            next();
        }).catch(err => { throw new Error(err)})
    }
    catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    }
}