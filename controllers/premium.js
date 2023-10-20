const User = require('../models/user')
const Expense = require('../models/expenses')
const DownloadedFile = require('../models/download');
const sequelize = require('../util/database')
const AWS =require('aws-sdk');
const UserServices = require('../services/userservices');
const S3services = require('../services/s3services');

exports.showleaderboard = async (req,res,next)=>{
    try{
        // console.log('chalalalalla')
            const expenses = await User.findAll ({ attributes: ['name' , 'totalexpenses' ] ,
                                                    order : [['totalexpenses' , "DESC"]]
                                                    });
        // const expenses = await User.findAll({ attributes : ['id','name' , [sequelize.fn('sum', sequelize.col('expenses.amount')) , 'total_cost']] ,
        //                                 include : [{model : Expense , attributes : []}] ,
        //                                 group : ['user.id'],
        //                                 order : [[sequelize.col("total_cost") , "DESC"]]
        //                                 });
        // const userAggregatedExpenses = {};
        // expenses.forEach((expense)=>{
        //     // console.log(expense.dataValues);
        //     if(userAggregatedExpenses[expense.dataValues.userId]){
        //         userAggregatedExpenses[expense.dataValues.userId]  = userAggregatedExpenses[expense.dataValues.userId] + expense.dataValues.amount ;
        //     }else{
        //         userAggregatedExpenses[expense.dataValues.userId]  =  expense.amount ;
        //     }
        // })

        // var leaderboardDetails = [];
        // users.forEach((user)=>{
        //     leaderboardDetails.push({name : user.name , total_cost : userAggregatedExpenses[user.id] || 0 })
        // })
        // leaderboardDetails.sort((a,b)=> b.total_cost - a.total_cost);
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

        DownloadedFile.findAll({ where: { UserId: id } })
            .then(file => {
                // console.log(file)
                res.status(200).json(file)
            }).catch(err => {
                throw new Error(err)
            })

    } catch (err) {
        console.log(err)
    }

}