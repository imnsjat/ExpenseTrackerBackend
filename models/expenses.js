const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const expense = sequelize.define('expense',{
    amount : { type : Sequelize.DOUBLE , allownull:false},
    description : { type : Sequelize.TEXT , allownull:false},
    category : { type : Sequelize.TEXT , allownull:false}
})

module.exports = expense;