const express=require('express');
const router=express.Router();
const Appointment =require('../models/appointment');
const { userAuth, isAdminAuth, isDoctor } = require('../middleware/userAuth');
const User=require('../models/user')
router.get('/getappointment',userAuth,isAdminAuth,async (req,res)=>{
    try{
        const appointment=await Appointment.find().populate('doctorId');
        res.status(200).json({
            data:appointment,
            message:"data fetch success"
        })

    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
});

// get appointment by doctorid
router.get('/doctor/:id',userAuth,isAdminAuth,async (req,res)=>{
    try{
        const doctorId=req.params.id
        const appointment=await Appointment.find({doctorId});
        res.status(200).json({
            data:appointment,
            message:"data fetch success"
        })

    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
});
// doctorappointprofile doctor see his list of appointment
router.get('/doctorappointprofile',userAuth,isDoctor,async (req,res)=>{
    try{
        const id=req.user?.id;
        const appointment=await Appointment.findById({doctorId:id}).select('-password');
        res.status(200).json({
            data:appointment,
            message:"data fetch success"
        })

    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
});
router.post('/bookappointment/:id', userAuth, async (req, res) => {
    try {
        const  doctorId  = req.params.id;
        const { patientId, date, timeSlot } = req.body;
        if (!patientId || !date || !timeSlot) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Validate date is in the future
        const appointmentDate = new Date(date);
        if (appointmentDate < new Date()) {
            return res.status(400).json({ message: "Appointment date must be in the future" });
        }
        const appointment = new Appointment({
            doctorId: doctorId,
            patientId,
            date: appointmentDate,
            timeSlot
        });
        const newAppointment = await appointment.save();
        res.status(201).json({
            message: "Appointment booked successfully",
            appointment: newAppointment
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({  
                message: "This time slot is already booked"
            });
        }
        console.error('Appointment booking error:', err);
        res.status(500).json({ 
            message: "Failed to book appointment",
            error: err.message
        });
    }
});
router.get('/available/:doctorId/:date',async (req,res)=>{
    try{
        const {doctorId,date}=req.params;
        
        const doctor=await User.findById({_id:doctorId});
        console.log(doctor)
        if(!doctor){
            return res.status(400).json({message:"doctor not found"})
        }
        const selectedDate=new Date(date);
        const startDay=new Date(selectedDate);
         startDay.setHours(0, 0, 0, 0);
        const endOfDay=new Date(selectedDate)
         endOfDay.setHours(23, 59, 59, 999);
        const bookedAppomtment=await Appointment.find({
            doctorId,
            date:{ $gte:startDay, $lte:endOfDay}
        });
        //get the booked time slot
        const bookedTimeSlot=bookedAppomtment.map(app=>app.timeSlot);
                const doctorTimeSlots = doctor.availableTimeSlots || [];
        // filter booked time slot from the doctor available time slot
        const availableTimeSlots=doctor.availableTimeSlots.filter(slot=> !bookedTimeSlot.includes(slot));
        res.json(availableTimeSlots)

    }catch(err){
        res.status(500).json(err.message)
    }
})
module.exports=router