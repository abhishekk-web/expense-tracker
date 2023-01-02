const User = require('../models/users');
const Sequelize = require('sequelize');
const Expense = require('../models/models');
const sequelize = require('../utils/database');
const e = require('express');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('data.expense')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_cost', 'DESC']]
        });
        
        res.status(200).json(leaderboardofusers);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}