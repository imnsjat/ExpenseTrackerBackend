const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY
const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender = {
    email : 'sheoran19997@gmail.com' ,
    name : 'expense-tracker'
}

const path = require('path');
exports.home = (req,res,next)=>{
    res.sendFile(path.join(__dirname,  '../forgotpassword.html'));
}

exports.forgotpassword = (req,res,next)=>{
    const email =  req.body.email;
    const recievers = [{email:email}]
    tranEmailApi.sendTransacEmail({sender , to : recievers , subject : 'link to reset password' , 
                                    textContent : ` please reset you password and remember it from next time`           
    }).then(()=>{
        res.status(200).json({msg : 'email sent to reset password'});
    }).catch(err=>console.log(err));

    
}