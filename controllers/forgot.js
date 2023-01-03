const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require("../models/users");
const ForgotPassword = require('../models/forgot');

exports.forgotPassword = async(req, res) => {

    try {

        const {email} = req.body;
        const user = await User.findOne({where: {email}});
        if(user) {
            const id = uuid.v4();
            console.log(id);
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                    console.log(err);
                })
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)  
            
            console.log(user.email);

            const msg = {
                to: user.email,
                from: 'abhi.chatterjee38@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and eady to do anywhere, even with Node.js',
                html: `<a href="http://localhost:4000/password/forgotpassword/${id}">Reset Password</a>`
            }

            sgMail.send(msg)
            .then((response) => {

                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true})

            })
            .catch((err) => {
                console.log(err);
            })

        }
        else{
            throw new Error('User does not exist');
        }

    }
    catch(err) {
        console.log(err);
        return res.json({message: err, success: false})
    }

}


