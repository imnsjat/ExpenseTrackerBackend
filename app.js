require('dotenv').config()
const express = require('express');

const cors = require('cors');

const sequelize = require('./util/database');
const authroutes = require('./routes/authroutes');
const expenseroutes = require('./routes/expenseroutes');
const purchaseroutes = require('./routes/purchase');
const premiumroutes = require('./routes/premium');
const User = require('./models/user');
const Order = require('./models/orders');
const Expenses = require('./models/expenses');



const app = express();
app.use(express.json());
app.use(cors());

app.use(authroutes);
app.use(expenseroutes);
app.use(purchaseroutes);
app.use(premiumroutes);

User.hasMany(Expenses);
Expenses.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=> console.log(err));

