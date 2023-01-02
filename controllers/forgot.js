const User = require("../models/users");

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true
    } else {
        return false;
    }
}

exports.forgotPassword = async(req, res) => {

    try {

        const {email} = req.body;
        console.log(email);
        if(isstringinvalid(email)){
            return res.status(400).json({message: 'Email id is missing'});
        }

        const user = await User.findAll({where : {email}})
        return res.status(202).json({message: 'All working fine'});

    }
    catch(err) {
        console.log("There is an error");
    }

}