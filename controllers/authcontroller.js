const User = require('../models/user'); 
const path = require('path');



exports.home = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../index.html'));
}
exports.signup = (req,res,next)=>{
    // console.log(req.body)
    const {name,email,password} = req.body ;
    if(name.length === 0 || name  == null || password == null || email == null || email.length === 0 || password.length === 0){
        res.status(400).json({err : "bad  parameters"})
    }
    User.findAll({where: {email:email}})
    .then(users =>{
        if(users[0]){
            res.json({"fialed" : "user exists"})
        }else{
            User.create({name:name , email : email , password : password})
            .then(()=> res.status(201).json({message : 'signed up successfully'}))
        }
    })
    
    .catch(err=>res.status(403).json(err));
}

exports.login = (req,res,next)=>{
    const {name,email,password} = req.body ;
    if(name.length === 0 || name  == null || password == null || email == null || email.length === 0 || password.length === 0){
        res.status(400).json({err : "bad  parameters"})
    }
    User.findAll({where: {email:email }})
    .then(users =>{
        if(users[0]){
            const user = users[0];
            if(user.dataValues.password === password){
                res.json({msg : "login successful"})
            }else{
                res.status(401).json({msg : "bad credentials"});
            }
            console.log(user.dataValues.password);
        }else{
            res.status(404).json({msg : "user not found"});
        }
    })
    
    .catch(err=>res.status(403).json(err));
}