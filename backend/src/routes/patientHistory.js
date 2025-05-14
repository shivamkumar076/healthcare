const express=require('express');
const { userAuth, isDoctor, isAdminAuth } = require('../middleware/userAuth');
const User = require('../models/user');
const Patienthistory = require('../models/patienthistory');
const router=express.Router();

router.post('/addpatienthistory/:id',userAuth,isDoctor,async(req,res)=>{
    try{
        const patient=req.params.id;
        const doctorid=req?.user;
        const {diagnosis,date,medicines,notes}=req.body;
        const patientexist=await User.findOne({patient});
        if(!patientexist){
            res.status(401).json({
                message:"patient does't exits"
            })
        };
        const data=new Patienthistory({
            patientId:patient,
            doctorId:doctorid,
            diagnosis,
            date,
            medicines,
            notes
        })
        await data.save();
        res.status(201).json({
            message:"add patient history success"
        })


    }catch(err){
        res.status(500).json({
            message:"addpatient error",
            error:err.message
        })
    }
})
router.get('/patienthistory/:patientId', userAuth, isDoctor, async (req, res) => {
  try {
    const doctorId = req.user; // set by userAuth middleware
    const { patientId } = req.params;

    // Fetch only the history created by this doctor for this patient
    const history = await Patienthistory.find({
      patientId,
      doctorId
    }).populate("patientId", "name email").populate("doctorId", "name email");

    if (!history || history.length === 0) {
      return res.status(404).json({
        message: "No history found for this patient by the logged-in doctor"
      });
    }

    res.status(200).json({
      message: "Patient history fetched successfully",
      data: history
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching patient history",
      error: err.message
    });
  }
});
router.get('/patienthistory', userAuth,isAdminAuth, async (req, res) => {
  try {
        const history = await Patienthistory.find({})

    if (!history || history.length === 0) {
      return res.status(404).json({
        message: "No history found for this patient by the logged-in doctor"
      });
    }

    res.status(200).json({
      message: "Patient history fetched successfully",
      data: history
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching patient history",
      error: err.message
    });
  }
});
router.get('/history/:patientId', userAuth, isAdminAuth, async (req, res) => {
  try {
   
    const { patientId } = req.params;

    // Fetch only the history created by this doctor for this patient
    const history = await Patienthistory.find({
      patientId,
    }).populate("patientId", "name email")

    if (!history || history.length === 0) {
      return res.status(404).json({
        message: "No history found for this patient by the logged-in doctor"
      });
    }

    res.status(200).json({
      message: "Patient history fetched successfully",
      data: history
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching patient history",
      error: err.message
    });
  }
});
module.exports=router