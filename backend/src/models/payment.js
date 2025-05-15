const mongoose = require("mongoose");
const PaymentSschema = new mongoose.Schema({
   patientId:{
    type:mongoose.Types.ObjectId,
    ref:"User",
    required:true
   },

   paymentId:{
    type:String,
   
  },
  orderId:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  },
  amount:{
    type:Number,
    required:true,

  },
  currency:{
    type:String,
    required:true,
  },
  receipt:{
    type:String,
    required:true,

  },
  notes:{
    firstName:{
      type:String,

    },
    lastName:{
      type:String
    }
  },
  currency:{
    type:String
  }
});
module.exports=mongoose.model('Payment',PaymentSschema);