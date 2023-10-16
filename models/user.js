const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user' , {
    name : Sequelize.STRING,
    email : {type : Sequelize.STRING , allowNull:false , primaryKey : true },
    password : Sequelize.STRING 
});


module.exports = User;