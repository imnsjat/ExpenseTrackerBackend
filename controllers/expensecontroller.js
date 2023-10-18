const Expense = require('../models/expenses');
const User = require('../models/user')

const path = require('path');
const sequelize = require('../util/database');

exports.app = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../expense.html'));
}

exports.postExpense =async (req,res,next)=>{
    const t = await  sequelize.transaction();
    try{
    const userId = req.user.id ; 
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    const expense = await Expense.create({amount : amount , description : description , category : category , userId : userId} , {transaction : t});
    const totalExpense = Number(req.user.totalexpenses) + Number(amount) ;
    await User.update({totalexpenses : totalExpense } , { where : { id : req.user.id} , transaction : t })
    t.commit();
    res.status(200).json({expense:expense})
    }
    catch(err){
        await t.rollback();
        console.log(err);
        return res.status(500).json({success:false , error : err});
    };
}

exports.getExpense = (req,res,next)=>{

    Expense.findAll({where : {userId : req.user.id}})
    .then((expenses)=>{
        // console.log('fetched' , expenses  );
        res.json(expenses);
    })
    .catch()
}

exports.deleteExpense=async (req,res,next)=>{
    
    const t = await  sequelize.transaction();
    try{
        const expid =req.body.id;
        const expense = await Expense.findAll({where :{id:expid , userId : req.user.id}, transaction : t });
        // console.log(expense[0]);
        const totalExpense = Number(req.user.totalexpenses) - Number(expense[0].amount) ;
        const user = await User.findOne({where : {id: req.user.id} , transaction : t})
        await user.update({totalexpenses : totalExpense }  , {transaction : t })
        await expense[0].destroy();
        await t.commit();
        res.status(200).json({expense:expense})

    }catch(err){ 
        await t.rollback();
        console.log(err);
        return res.status(500).json({success:false , error : err});
    }

}