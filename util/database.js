const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete','root','imnsjat',{dialect:'mysql',host:'localhost'});
module.exports = sequelize;