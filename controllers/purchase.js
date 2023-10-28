const razorpay =require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

exports.purchasepremium = async (req,res,next)=>{
    try{
        var rzp = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID ,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 1000;

        rzp.orders.create({amount , currency: "INR"}, async (err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            const newOrder = new Order({orderid: order.id , status : 'PENDING', userId: req.user._id});
            await newOrder.save();
            return res.status(201).json({order , key_id: rzp.key_id});
        })
    }catch(err){
        console.log(err);
        res.status(403).json({message: ' something went wrong ' , error : err})
    }
}

exports.updateTransaction = async (req,res,next)=>{
    try{
        const { payment_id , order_id} =req.body ;
        const id = req.user._id ;
        const user = await User.findById(req.user.id)
        const order = await Order.findOne({orderid : order_id });
        const promise1 = order.updateOne({paymentid : payment_id , status : 'SUCCESSFUL' });
        user.ispremiumuser = true;
        const promise2 =user.save();
        const token =  await jwt.sign({ id: id , ispremiumuser : true }, process.env.TOKEN_SECRET, { expiresIn: '1h' });        
        Promise.all([promise1 , promise2]).then(()=>{
            return res.status(201).json({success : true , message : 'Transaction Successful' , token : token });
        }).catch(err=>{
            throw new Error(err);
        })
    }catch(err){
        console.log(err);
        res.status(403).json({message: ' updating transaction something went wrong ' , error : err})
    }
}

exports.updateTransactionFail = async (req,res,next)=>{
    try{
        const {  order_id} =req.body ;
        const order = await Order.findOne({orderid : order_id });
        await order.updateOne({ status : 'FAILED' })
        return res.status(400).json({success : false , message : 'Transaction Failed'});
    }catch(err){
        console.log(err);
        res.status(403).json({message: ' updating transaction something went wrong ' , error : err})
    }
}
