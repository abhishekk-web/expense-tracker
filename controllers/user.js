const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } else {
        return false;
    }
}



exports.signup = async (req, res) => {

    try{
    const {name, email, password} = req.body;
    console.log('email', email)
    console.log('password',password)
    if(isstringinvalid(name)|| isstringinvalid(email || isstringinvalid(password)))  {
        console.log("Okay done")
        return res.status(400).json({err: "Bad parameters... something is missing"})
    
    }

    console.log("all well");
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async(err, hash) => {
        console.log(err);
        await User.create({name, email, password: hash})
        res.status(201).json({message: 'Successfully create new user'})
    })
    }catch(err) {
        res.status(500).json(err);
        // console.log("just a error");
    }

}    

function generateAccessToken(id, name) {
    return jwt.sign({userId : id, name: name}, "secrets")
}
    
exports.login = async (req, res) => {

    try {

    const {email, password} = req.body;
    if(isstringinvalid(email) || isstringinvalid(password)){
        return res.status(400).json({message: 'Email id or password is missing'});
    }
    console.log(password);

    const user = await User.findAll({where : {email}})
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    throw new Error('Something went wrong');
                }
                if(result === true){
                    return res.status(200).json({success: true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name)})
                }
                else{
                    return res.status(400).json({success: false, message: "password is incorrect"})
                }
            })
        }
        else{
            return res.status(404).json({success: false, message: "User doesn't exist"});
        }
    }
    catch(err) {
        res.status(500).json({message: err, success: false})
    }

}