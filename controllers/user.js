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
    
