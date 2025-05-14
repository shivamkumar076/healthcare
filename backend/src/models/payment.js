const mongoose = require("mongoose");
const PaymentSschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  amount: {
    type: Number,
  },

  currency: {
    type: String,
  },
  paymentProvider: "stripe" | "razorpay",
  paymentStatus: "paid" | "failed",
  transactionId: String,
  createdAt: Date,
});
module.exports=mongoose.model('Payment',PaymentSschema);