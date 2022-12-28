const Razorpay = require("razorpay");
const Order = require('../models/orders');
// require('dotenv').config()

// const jwt = require('jsonwebtoken');
// const User = require('../models/users');

// function generateAccessToken(id, name) {
//     return jwt.sign({userId : id, name: name, ispremiumuser: ispremiumuser}, "secrets")
// }

exports.purchasepremium = async( req, res) => {
    // console.log("hello");
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
            
        })
        // console.log(process.env.RAZORPAY_KEY_ID);
        console.log(rzp);
        
        const amount = 2500;

        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if(err) {
                console.log(err);
                // throw new Error(err);
            }
            console.log("the ln 30 ", req.user);
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

exports.updatetransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({where : {orderid : order_id}})
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
        const promise2 = req.user.update({premiumuser: true});

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({sucess: true, message: "Transaction Successful"});
        }).catch((err)=> {
            throw new Error;
        })

        
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Something went wrong' })

    }
}
