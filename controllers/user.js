const User = require("../models/users");

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
    if(isstringinvalid(name)|| isstringinvalid(email) || isstringinvalid(password))  {
        console.log("Okay done")
        return res.status(400).json({err: "Bad parameters... something is missing"})
    
    }

    console.log("all well");
    await User.create({name, email, password})
        res.status(201).json({message: 'Successfully create new user'})

}catch(err) {
            // res.status(500).json(err);
            console.log("just a error");
        }

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
            if(user[0].password === password){
                res.status(200).json({success: true, message: "User logged in successfully"})
            }
            else{
                return res.status(400).json({success: false, message: "password is incorrect"})
            }
        }
        else{
            return res.status(404).json({success: false, message: "User doesn't exist"});
        }
    }
    catch(err) {
        res.status(500).json({message: err, success: false})
    }

}