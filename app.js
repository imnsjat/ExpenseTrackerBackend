const express = require('express');

const cors = require('cors');

const sequelize = require('./util/database');
const authroutes = require('./routes/authroutes');
const expenseroutes = require('./routes/expenseroutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use(authroutes);
app.use(expenseroutes);

sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=> console.log(err));

