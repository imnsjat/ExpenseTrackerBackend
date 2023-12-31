const { v4: uuidv4 } = require('uuid');
const ForGotPassword =require('../models/forgotpassword');
const User = require('../models/user'); 
const bcrypt =  require('bcrypt');
const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender = {
    email : 'sheoran19997@gmail.com' ,
    name : 'expense-tracker'
}

const path = require('path');
exports.home = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../forgotpassword.html'));
}

exports.forgotpassword = async (req,res,next)=>{
    try{
        const email =  req.body.email;
        const user = await User.findOne({email:email});
        if(user){
            const uuid = uuidv4();
            await ForGotPassword.create({ uuid : uuid , userId : user._id })
            const recievers = [{email:email}]
            await tranEmailApi.sendTransacEmail({sender , to : recievers , subject : 'link to reset password' , 
                                                textContent : `http://localhost:3000/password/resetpassword/{{params.uuid}}` ,
                                                params :{uuid : uuid} })
            const link = `http://localhost:3000/password/resetpassword/${uuid}` ;
            res.status(200).json({msg : 'email sent to reset password' , link : link  });
            
        }else{
            res.status(400).json({msg : 'enter valid email id'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error : err});
    }
    

    
}

exports.resetpassword = async(req,res,next)=>{
    try{
        const uuid = req.params.uuid ;
        const  forgotpasswords = await ForGotPassword.findOne({ uuid : uuid , isActive : true});
        if(forgotpasswords){
            forgotpasswords.isActive= false;
            await forgotpasswords.save();
            res.sendFile(path.join(__dirname,  '../resetpassword.html'));
        }else{
            res.status(400).json({message : 'invalid request'})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error : err});
    }
}

exports.updatepassword = async(req,res,next)=>{
    try{
        const {email , password } = req.body ;
        const user = await User.findOne({email:email});
        if(user){
            bcrypt.hash(password , 10 , async ( err , hash)=>{
                user.password= hash;
                await user.save();
                res.status(201).json({message : 'password changed  successfully'})
            })
        }else{
            res.status(400).json({message : 'no such user exists'})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error : err});
    }
}
