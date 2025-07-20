const express=require('express');
const router=express.Router();
const Appointment =require('../models/appointment');
const { userAuth, isAdminAuth, isDoctor } = require('../middleware/userAuth');
const User=require('../models/user')
const moment = require("moment-timezone");
const Payment=require('../models/payment')
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
        const { patientId, date, timeSlot,paymentId } = req.body;
        if (!patientId || !date || !timeSlot || !doctorId || !paymentId) {
            return res.status(400).json({ message: "All fields are required" });
        }

         const payment = await Payment.findById(paymentId);
    if (!payment || !["captured", "authorized"].includes(payment.status)) {
      return res.status(400).json({ message: 'Payment not completed or verified' });
    }
        // Validate date is in the future
//  const appointmentDate = new Date(date);
const appointmentDate = moment.tz(date, "YYYY-MM-DD", "Asia/Kolkata").toDate();
    //   const appointmentDate = new Date(`${date}T00:00:00+05:30`);
        if (appointmentDate < new Date()) {
            return res.status(400).json({ message: "Appointment date must be in the future" });
        }
       
        const formattedDate = appointmentDate.toISOString().split('T')[0];
        console.log(`Checking if time slot ${timeSlot} is available on ${formattedDate}`);
        
        const existingAppointment = await Appointment.findOne({
            doctorId,
            timeSlot,
            date: {
                $gte: new Date(`${formattedDate}T00:00:00.000Z`),
                $lte: new Date(`${formattedDate}T23:59:59.999Z`)
            }
        });
        
        if (existingAppointment) {
            console.log('Appointment already exists:', existingAppointment);
            return res.status(409).json({
                message: "This time slot is already booked"
            });
        }
         const appointment = new Appointment({
            doctorId: doctorId,
            patientId,
            date: appointmentDate,
            timeSlot,
            paymentId:patientId
        });
        const newAppointment = await appointment.save();
        res.status(201).json({
            message: "Appointment booked successfully",
            appointment: newAppointment
        });
        //confus
            await updateSlotAvailability(doctorId, date, timeSlot);

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
router.get('/available/:doctorId/:date', async (req, res) => {
    try {
        const { doctorId, date } = req.params;
        const doctor = await User.findById(doctorId);
        
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        
        const selectedDate = new Date(date);
        const startDay = new Date(selectedDate);
        startDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Get all appointments for this doctor on the selected date
        const bookedAppointments = await Appointment.find({
            doctorId,
            date: { $gte: startDay, $lte: endOfDay }
        });
        
        // Extract the booked time slots
        const bookedTimeSlots = bookedAppointments.map(app => app.timeSlot);
        
        // Make sure doctor has availableTimeSlots property
        const doctorTimeSlots = doctor.availableTimeSlots || [];
        
        // Filter out booked time slots from the doctor's available time slots
        const availableTimeSlots = doctorTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));
        
        console.log('Doctor slots:', doctorTimeSlots);
        console.log('Booked slots:', bookedTimeSlots);
        console.log('Available slots:', availableTimeSlots);
        
        res.json(availableTimeSlots);
    } catch (err) {
        console.error('Error getting available slots:', err);
        res.status(500).json({ message: err.message });
    }
});
module.exports=router