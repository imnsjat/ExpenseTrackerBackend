const User = require('../models/user')
const Expense = require('../models/expenses')
const sequelize = require('../util/database')

exports.showleaderboard = async (req,res,next)=>{
    try{
        // console.log('chalalalalla')
        const expenses = await User.findAll({ attributes : ['id','name' , [sequelize.fn('sum', sequelize.col('expenses.amount')) , 'total_cost']] ,
                                        include : [{model : Expense , attributes : []}] ,
                                        group : ['user.id'],
                                        order : [[sequelize.col("total_cost") , "DESC"]]
                                        });
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