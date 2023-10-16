const User = require('../models/user'); 
const path = require('path');

exports.home = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../index.html'));
}
exports.signup = (req,res,next)=>{
    // console.log(req.body)
    const {name,email,password} = req.body ;
    User.findAll({where: {email:email}})
    .then(users =>{
        if(users[0]){
            res.json({"fialed" : "user exists"})
        }else{
            User.create({name:name , email : email , password : password})
            .then(()=> res.json({"success": " snfsj"}))
        }
    })
    
    .catch(err=>console.log(err));
}