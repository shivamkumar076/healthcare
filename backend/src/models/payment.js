const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  paymentId: {
    type: String,
    // Will be populated after successful payment
  },
  orderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["created", "authorized", "captured", "failed", "refunded"]
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
    required: true,
  },
  notes: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String
    },
    email: {
      type: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);