const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NUMBER } = require('sequelize');

exports.authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        // console.log('tokenrcvd' , token);
        const user = jwt.verify(token ,'Th1s1sJATSecr3tKey!' );
        const userid = user.id;
        console.log('user id : ', userid);
        User.findByPk(userid).then(
            user=>{

                // console.log('user verified' , JSON.stringify(user));
                req.user=user;
                next();
            }
        ).catch(err=> { throw new Error(err)})
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }
}