const User = require('../models/user')
const Expense = require('../models/expenses')
const DownloadedFile = require('../models/download');
const AWS =require('aws-sdk');
const UserServices = require('../services/userservices');
const S3services = require('../services/s3services');

exports.showleaderboard = async (req,res,next)=>{
    try{
        const expenses = await User.find().sort({totalexpenses: -1}).select('name totalexpenses');
        res.status(200).json(expenses);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

exports.download = async(req,res,next)=>{
    try{
        const userid = req.user.id ;
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const filename =`Expenses${userid}/${new Date()}.txt`;
        const fileUrl = await S3services.uploadtoS3(stringifiedExpenses,filename);
        const z = await DownloadedFile.create({ url: fileUrl, userId: userid, date: new Date() })
        res.status(200).json({fileUrl , success : true});
    }catch(err){
        console.log(err);
        res.status(500).json({fileUrl : '' , success : false , err : err} )
    }
    
}

exports.allUrl = (req, res, next) => {
    try {
        const id = req.user.id;
        DownloadedFile.find({ UserId: id })
            .then(file => {
                res.status(200).json(file)
            }).catch(err => {
                throw new Error(err)
            })
    } catch (err) {
        console.log(err)
    }
}
