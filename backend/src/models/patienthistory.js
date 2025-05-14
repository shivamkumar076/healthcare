const mongoose = require("mongoose");
const patienthistorySchema = new mongoose.model(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    diagnosis: String,
    date: Date,
    medicines: [
      {
        name: String,
        dosage: String,
        duration: String,
      },
    ],
    notes:{
      type:String,
      maxLength:30

    } 
    
  },
  {
    timestamp: true,
  }
);
module.exports = mongoose.model("Patienthistory", patienthistorySchema);
