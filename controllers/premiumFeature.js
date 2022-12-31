const User = require('../models/users');
const Expense = require('../models/models');
const sequelize = require('../utils/database');
const e = require('express');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {};
        console.log(expenses);
        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId]) {
                userAggregatedExpenses[expense.userId] += expense.expense;
            }
            else{
                userAggregatedExpenses[expense.userId] = expense.expense;
            }
            
        })
        var userLeaderBoardDetails = [];
        users.forEach((user)=> {
            userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpenses[user.id] || 0})
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost);
        res.status(200).json(userLeaderBoardDetails);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}