const Data = require("../models/models");


exports.postAddData = async(req, res, next)=>{

    try{
        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;
        console.log(expense);

        const data = await Data.create({expense: expense, description: description, category: category});
        res.status(200).json({allData: data});
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
}

exports.getData = async (req, res, next)=>{

    try {

        const data = await Data.findAll();
        res.status(200).json({allData: data});
        console.log(data.allData);

    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }


}

exports.deletePost = async (req, res, next)=>{

   try{

    if(!req.params.id == 'undefined'){
        console.log('ID is missing');
        return res.status(404).json({err: 'ID is mssing'})
    }
    const userId = req.params.id;
    
    console.log("user id is : "+ userId);
    await Data.destroy({where: {id: userId}});
    res.sendStatus(200);
   }
   catch(err){
        console.log(err);
        res.sendStatus(500).json(err);
   }
}