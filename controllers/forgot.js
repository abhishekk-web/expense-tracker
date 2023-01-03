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

exports.resetpassword = (req, res) => {
    const id = req.params.id;
    ForgotPassword.findOne({where : {id}}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        console.log('called')
                    }
                    </script>
                    <div style="height: 100%;">
                    <form style="border: 2px solid black; border-radius: 4px; margin-top: 200px;text-align: center;height: 180px;width: 700px; margin-left: 350px;" action="/password/updatepassword/${id}" method="get">
                        <br><br><label style="font-weight: bold" for="newpassword">Enter New password</label><br><br>
                        <input style="width: 300px" name="newpassword" type="password" placeholder="Enter your new password" required></input><br><br>
                        <button>reset password</button>
                    </form>
                    </div>
            </html>`)

            res.send();
        }
    })
}


exports.updatepassword = async(req, res) => {
    
    try {
        const {newpassword } = req.query;
        const {resetpasswordid} = req.params;
        ForgotPassword.findOne({where: {id: resetpasswordid}}).then(resetpasswordrequest => {
            User.findOne({where: {id : resetpasswordrequest.userId}}).then(user => {
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({password: hash}).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
                } else {
                    console.log(err);
                    return res.status(404).json({error: 'No user Exists', success: false});
                }
            })
        })
    } catch(err) {
        console.log(err);
        return res.status(403).json({err, success: false});
    }

}