const express = require('express');
const cors = require('cors');

const sequelize = require('./util/database');
const authroutes = require('./routes/authroutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use(authroutes);

sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=> console.log(err));

