const Expense = require('../models/expenses');
const User = require('../models/user')

const path = require('path');

exports.app = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../expense.html'));
}

exports.postExpense =async (req,res,next)=>{
    try{
        const userId = req.user.id ; 
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const expense = await Expense.create({amount : amount , description : description , category : category , userId : userId});
        const user = await User.findById(userId);
        user.totalexpenses += Number(amount);
        await user.save();
    
        res.status(200).json({expense:expense})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false , error : err});
    };
}

exports.getExpense = (req,res,next)=>{
    const itemsParPage = Number(req.headers.items);
    const of = ((req.query.page || 1) - 1);
    Expense.find({ userId: req.user.id }).skip(of * itemsParPage).limit(itemsParPage)
        .then(async result => {
            let pre; let nex; let prev; let nextv;
            if (of === 0) {
                pre = false;
            } else {
                pre = true;
                prev = of;
            }
            const ans = await Expense.find({ UserId: req.user.id }).skip((of + 1) * itemsParPage).limit(itemsParPage);
            if (ans.length > 0) {
                nex = true;
                nextv = Number(of) + Number(2);
            } else {
                nex = false;
            }
            res.json({ result, pre, nex, nextv, prev })
        }).catch(err=> console.log(err));
}

exports.deleteExpense=async (req,res,next)=>{
    
    try{
        const expid =req.body._id;
        const expense = await Expense.findByIdAndRemove(expid);
        if (!expense) {
            throw new Error('Expense not found');
          }
        if(expense.userId.toString() !== req.user.id.toString()){
            throw new Error('Unauthorized');
        }
        const user = await User.findById(req.user.id)
        user.totalexpenses -= Number(expense.amount) ;
        await user.save();
        
        res.status(200).json({expense:expense})

    }catch(err){ 
        console.log(err);
        return res.status(500).json({success:false , error : err});
    }

}
