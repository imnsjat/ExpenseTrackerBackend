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

async function nextt(id, offset, itemsParPage) {
    try {
        const result = await Expense.findAll({
            where: { UserId: id },
            limit: itemsParPage,
            offset: offset
        })

        if (result.length > 0) {
            // console.log(result);
            return true;
        }
        // console.log(false);
        return false;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

exports.getExpense = (req,res,next)=>{

    // Expense.findAll({where : {userId : req.user.id}})
    // .then((expenses)=>{
    //     // console.log('fetched' , expenses  );
    //     res.json(expenses);
    // })
    // .catch()
    const itemsParPage = 2;
    const of = ((req.query.page || 1) - 1);
    console.log(of, '63 PER OFF HAI ');
    Expense.findAll({
        where: { userId: req.user.id },
        offset: of * itemsParPage,
        limit: itemsParPage
    })
        .then(async result => {
            let pre; let nex; let prev; let nextv;
            if (of === 0) {
                pre = false;
            } else {
                pre = true;
                prev = of;
            }
            const ans = await nextt(req.user.id, (of + 1) * itemsParPage, itemsParPage);
            if (ans === true) {
                nex = true;
                nextv = Number(of) + Number(2);
            } else {
                nex = false;
            }
            console.log(prev, 'PREVIOUSBUTTON');
            console.log(pre, 'PREBUTTON');
            // console.log(nex, 'nexIOUSBUTTON');
            // console.log(nextv, 'nextvOUSBUTTON');
            // console.log(result, 'resuyltyBUTTON');
            console.log(result,'RESULT IN BUTTONS OF GET');
            res.json({ result, pre, nex, nextv, prev })
        }).catch(err=> console.log(err));
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