const User = require('../models/user'); 
const path = require('path');
const bcrypt =  require('bcrypt');




exports.home = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../index.html'));
}
exports.signup = async (req,res,next)=>{
    // console.log(req.body)
    try{
        const {name,email,password} = req.body ;
        if(name.length === 0 || name  == null || password == null || email == null || email.length === 0 || password.length === 0){
            res.status(400).json({err : "bad  parameters"})
        }
        const users = await User.findAll({where: {email:email}});
        if(users[0]){
                res.status(403).json({"failed" : "user exists"})
        }else{
                bcrypt.hash(password , 10 , async ( err , hash)=>{
                    await User.create({name:name , email : email , password : hash})
                    res.status(201).json({message : 'signed up successfully'})
                })
                
        }
    }catch(err) {
            res.status(500).json(err);
    }
    
    
}

exports.login = async (req,res,next)=>{
    try{
        const {name,email,password} = req.body ;
        if(name.length === 0 || name  == null || password == null || email == null || email.length === 0 || password.length === 0){
            res.status(400).json({err : "bad  parameters"})
        }
        const users = await User.findAll({where: {email:email }});
        
        if(users[0]){
            const user = users[0];
            bcrypt.compare(password,user.dataValues.password , (err, response )=>{
                if(response == true){
                res.status(200).json({msg : "login successful"})
                }else{
                    res.status(401).json({msg : "bad credentials"});
                }
            })
        }else{
            res.status(404).json({msg : "user not found"});
        }

    }catch(err){
        res.status(500).json(err)
    }
}