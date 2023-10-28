require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const path = require('path');
// const sequelize = require('./util/database');
const authroutes = require('./routes/authroutes');
const forgotpasswordroutes = require('./routes/forgotpassword');
const expenseroutes = require('./routes/expenseroutes');
const purchaseroutes = require('./routes/purchase');
const premiumroutes = require('./routes/premium');
// const User = require('./models/user');
// const Order = require('./models/orders');
// const Expenses = require('./models/expenses');
// const forGotPassword = require('./models/forgotpassword');
// const DownloadedFile = require('./models/download');

const app = express();
app.use(express.json());
app.use(cors());

app.use(authroutes);
app.use(forgotpasswordroutes);
app.use(expenseroutes);
app.use(purchaseroutes);
app.use(premiumroutes);

// User.hasMany(Expenses);
// Expenses.belongsTo(User);
// User.hasMany(Order);
// Order.belongsTo(User);
// User.hasMany(forGotPassword);
// forGotPassword.belongsTo(User);
// User.hasMany(DownloadedFile);
// DownloadedFile.belongsTo(User);

// sequelize.sync({force:true})
// .then(()=>{
//     app.listen(process.env.PORT || 3000);
// })
// .catch(err=> console.log(err));

mongoose
  .connect(
    process.env.MONGO_LINK
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

