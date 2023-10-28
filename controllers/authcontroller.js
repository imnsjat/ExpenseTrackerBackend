const User = require('../models/user'); 
const path = require('path');
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');



exports.home = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../index.html'));
}
exports.signup = async (req,res,next)=>{
    console.log(req.body)
    try{
        const {name,email,password} = req.body ;
        if(name.length === 0 || name  == null || password == null || email == null || email.length === 0 || password.length === 0){
            res.status(400).json({err : "bad  parameters"})
        }
        const user = await User.findOne({email:email});
        if(user){
                res.status(403).json({"failed" : "user exists"})
        }else{
                bcrypt.hash(password , 10 , async ( err , hash)=>{
                    await User.create({name:name , email : email , password : hash})
                    res.status(201).json({message : 'signed up successfully'})
                })
                
        }
    }catch(err) {
            console.log(err)
            res.status(500).json({"msg" : err});
    }
    
    
}

exports.login = async (req,res,next)=>{
    try{console.log(req.body)   
        const {email,password} = req.body ;
        if( password == null || email == null || email.length === 0 || password.length === 0){
            res.status(400).json({err : "bad  parameters"})
        }
        const user = await User.findOne({email:email});
        console.log(user)
        
        if(user){
            bcrypt.compare(password,user.password , async  (err, response )=>{
                if(response == true){
                    const token =  await jwt.sign({ id: user.id , ispremiumuser : user.ispremiumuser }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
                    res.status(200).json({
                        message: 'Login successful',
                        user: { username: req.body.username  },
                        token : token
                     });
                }else{
                    res.status(401).json({msg : "bad credentials"});
                }
            })
        }else{
            console.log('users' , users);
            res.status(404).json({msg : "user not found"});
        }

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

