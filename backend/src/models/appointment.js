const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot:{
    type:String,
    required:true,
  },
//   startTime: {
//     type: String,
//     required: true
//   },
//   endTime: {
//     type: String,
//     required: true
//   },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'refunded'],
//     default: 'pending'
//   },
//   paymentId: {
//     type: String
//   },
//   fee: {
//     type: Number,
//     required: true
//   },
  notes: {
    type: String
  },

  
}, {
  timestamps: true
});

// Index to ensure a doctor cannot have multiple appointments at the same time
appointmentSchema.index(
    { doctorId: 1, date: 1, timeSlot: 1 },
    { unique: true }
);

appointmentSchema.index({ patientId: 1, date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });
module.exports = mongoose.model('Appointment', appointmentSchema);