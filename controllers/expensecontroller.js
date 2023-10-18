const Expense = require('../models/expenses');
const User = require('../models/user')

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
    .then((expense)=>{
        const totalExpense = Number(req.user.totalexpenses) + Number(amount) ;
        User.update({totalexpenses : totalExpense } , { where : { id : req.user.id}}).then(()=>{
            res.status(200).json({expense:expense})
        }).catch(err=>{
            throw new Error(err);
        })
    })
    .catch(err => {
        throw new Error(err);
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({success:false , error : err});
    });
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