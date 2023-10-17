const Expense = require('../models/expenses');

const path = require('path');

exports.app = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../expense.html'));
}

exports.postExpense =(req,res,next)=>{
    const userId = req.user.id ; 
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    Expense.create({amount : amount , description : description , category : category , userId : userId})
    .then((data)=>res.json(data))
    .catch(err=>console.log(err));
}

exports.getExpense = (req,res,next)=>{

    Expense.findAll({where : {userId : req.user.id}})
    .then((expenses)=>{
        // console.log('fetched' , expenses  );
        res.json(expenses);
    })
    .catch()
}

exports.deleteExpense=(req,res,next)=>{
    const expid =req.body.id;
    Expense.findAll({where :{id:expid , userId : req.user.id}})
    .then( expense =>{
        return expense[0].destroy();
    }
    ).then((data)=>res.json(data))
    .catch(err=>console.log(err))

}