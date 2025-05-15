const express=require('express');
const router=express.Router();
const razorpayInstance=require('../utils/razorpay');
const { userAuth } = require('../middleware/userAuth');
const Payment = require('../models/payment');
const {validateWebhookSignature}=require('razorpay/dist/utils/razorpay-utils')

router.post('/payment/create',userAuth,async(req,res)=>{
    try{
        const {firstName,lastName,email}=req.user;
        
      const order= await razorpayInstance.orders.create({
            "amount":50000,
            "currency":"INR",
            "receipt":"receipt#1",
            "notes":{
                firstName,
                lastName
            }
        });

        const payment=new Payment({
            patientId:req.user?._id, 
            orderId:order.id,
            status:order.status,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes,
            
        });
        const savedata=await  payment.save();
        res.json({...savedata.toJSON(),keyId:process.env.Razarpay_key_id})

    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})
router.post('/auth/payment/webhook',async(req,res)=>{
    try{
        const webhookSignature=req.get["X-Razorpay-Signature"]
        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.webhooksecret )
        if(!isWebhookValid){
            return res.status(400).json({
                message:"webhook signature is invalid"
            })

        }
        const paymentDetails=req.body.payload.payment.entity;
        const payment=await Payment.findOne({orderId:paymentDetails.order_id});
        payment.status=paymentDetails.status;
        await payment.save();   
        if(req.body.event=="payment.captured"){


        }
          if(req.body.event=="payment.failed"){
                

        }
        return res.status(200).json({message:"webhook recieved successfully"})
    }catch(err){

        return res.status(400).json({
            message:err.message
        })


    }

})


module.exports=router;