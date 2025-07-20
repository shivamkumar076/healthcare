const express=require('express');
const router=express.Router();
const razorpayInstance=require('../utils/razorpay');
const { userAuth } = require('../middleware/userAuth');
const Payment = require('../models/payment');
const User=require('../models/user')
const {validateWebhookSignature}=require('razorpay/dist/utils/razorpay-utils')

router.post('/payment/create',userAuth,async(req,res)=>{
    try{
        const {firstName,lastName,email}=req.user;
        
      const order= await razorpayInstance.orders.create({
            "amount":100,
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
        const webhookSignature=req.get("X-Razorpay-Signature")
        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), 
        webhookSignature, 
        process.env.webhooksecret 
    )
        if(!isWebhookValid){
            return res.status(400).json({
                message:"webhook signature is invalid"
            })

        }

         const event = req.body.event;
         if (event === "payment.captured" || event === "payment.authorized") {
            const paymentDetails = req.body.payload.payment.entity;

            const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }
            payment.status = paymentDetails.status;
            payment.paymentId = paymentDetails.id;
            await payment.save();

               const user = await User.findOne({ _id: payment.patientId }); // Changed from userId to patientId
            if (user) {
                user.ispayment = true;
                await user.save();
            }
         }
else if (event === "payment.failed") {
            const paymentDetails = req.body.payload.payment.entity;
            
            // Update payment record with failed status
            const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
            if (payment) {
                payment.status = "failed";
                await payment.save();
            }
        }
   
        // }
        return res.status(200).json({message:"webhook recieved successfully"})
    }catch(err){
  console.error('Webhook error:', err);
        return res.status(400).json({
            message:err.message
        })


    }

})
// Endpoint to verify payment status for user
router.get('/payment/verify/:paymentId', userAuth, async(req, res) => {
    try {
        const { paymentId } = req.params;
        
        // Find payment by ID
        const payment = await Payment.findById(paymentId);
        
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        
        // Check if payment is authorized or captured
        const isPaymentSuccessful = ["authorized", "captured"].includes(payment.status);
        
        return res.status(200).json({
            success: isPaymentSuccessful,
            status: payment.status
        });
    } catch(err) {
        console.error('Payment verification error:', err);
        return res.status(500).json({
            message: err.message || 'Error verifying payment'
        });
    }
});
// Check if user has made a payment
router.get('/ispayment/verify', userAuth, async(req, res) => {
    const user = req.user;
    return res.status(200).json({
        ispayment: !!user.ispayment
    });
});


module.exports=router;