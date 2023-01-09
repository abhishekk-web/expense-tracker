const Data = require("../models/models");
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');

const ITEMS_PER_PAGE = 2;

exports.postAddData = async(req, res, next)=>{

    try{
        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;
        console.log(expense);

        if(expense == undefined || expense.length === 0) {
            return res.status(400).json({success: false, message: "parameters missing"})
        }

        const data = await Data.create({expense: expense, description: description, category: category, userId: req.user.id});
        console.log("the data is ", data);
        return res.status(200).json({allData: data});
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
}

exports.getData = async (req, res, next)=>{

    try{

        const page = +req.query.page || 1;
        var totalItems;
        
        const totals = await Data.count({where: {userId: req.user.id}}).then((totals) => {
            totalItems = totals;
            return Data.findAll({
                
                where:{userId: req.user.id}, 
                offset: (page - 1) * ITEMS_PER_PAGE,
                limit: ITEMS_PER_PAGE
            })
        })
            
        .then(data => {
            res.json({
              allData: data,
              currentPage: page,
              hasNextPage: ITEMS_PER_PAGE * page < totalItems,
              nextPage: +page + 1,
              hasPreviousPage: page > 1,
              PreviousPage: +page - 1,
              lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
              });
        console.log(data);
        })

    }
    catch(err)  {
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
    const rows = await Data.destroy({where: {id: userId, userId: req.user.id}});
    console.log(rows);
    if(rows === 0){
        return res.status(404).json({success: false, message: "Expense doesn't belong to the user"});
    }
  
    return res.status(200).json({success: true, message: "Deleted Successfully"});
   }
   catch(err){
        console.log(err);
        res.sendStatus(500).json(err);
   }
}

exports.datasPost = async (req, res, next)=>{

    try{

        const expense = req.body.expense;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Data.create({expense: expense, description: description, category: category});
        res.status(200).json({allData: data});

    }
    catch(err){

        res.status(500).json({
            error: err
        })

    }

}



exports.downloadExpenses = async(req, res) => {

    try{
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
    

    try {
        const expenses = await UserServices.getData(req);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);

        const userId = req.user.id;

        const filename = `Expenses${userId}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({fileURL, success: true})
    }
    catch(err) {
        console.log(err);
        res.status(500).json({fileURL: '', success: false, err: err})
    }
}
catch(err) {
    console.log(err);
}

}