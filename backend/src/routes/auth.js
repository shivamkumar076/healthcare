const express=require('express');
const {validatedata} = require('../utils/validation');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const multer=require('multer')
const { userAuth, isAdminAuth } = require('../middleware/userAuth');

const router=express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  
  // filter file
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("only image  are allowed"), false);
    }
  };
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      //to limit 2 mb size to avoid large size
      fileSize: 2 * 1024 * 1024,
    },
  });

router.post("/register",async (req,res)=>{
    try{
        validatedata(req);
        const {email,password,firstName,lastName}=req.body;
        console.log(email)
        const user=await User.findOne({email})
        if(user){
            res.status(409).json({
                message:"user already exist"
            })
        }
        const hashPassword=await bcrypt.hash(password,10);
        const data=new User({
            email,
            firstName,
            lastName,
            password:hashPassword
        })
        const savedata=await data.save();
        const token=await savedata.getJWT()
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            // secure: process.env.NODE_ENV === 'production', // Ensures cookies are only sent over HTTPS in production
            maxAge: 60 * 60 * 1000, // Cookie expiration time (24 hours)
            sameSite: 'strict' // Prevents the browser from sending this cookie along with cross-site requests
        });
       res.status(201).json({
        message:"Registration successfully",
        data:savedata,
       })
    }catch(err){
        console.error(err);
        res.status(401).json({
            message:"register error"
        })
    }

});
router.post('/login',async (req,res)=>{
    try{
        const {email,password}=req.body
        const userexist=await User.findOne({email})
        if(!userexist){
            return res.status(401).json({
                message:"invalid credentials"
            })
        }
        const ispassword=await userexist.validatepassword(password);
     
        if(ispassword){
            const token=await userexist.getJWT();
            res.cookie('token',token,{
                httpOnly: true, 
                // secure: process.env.NODE_ENV === 'production',
                maxAge:  60 * 60 * 1000, 
                sameSite: 'strict' 
            })
            return res.status(200).json({
                message:"login successfully",
                data:userexist
            })
        }else{
            throw new Error("invalid credentials")
        }
    }catch(err){
        console.error(err)
        res.status(401).json({
            message:"invalid credential",
            error:err.message
        })
    }

});
router.post('/logout',async(req,res)=>{
    try{
            res.clearCookie('token');
   return res.json({ message: "Logged out successfully" });

    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})
router.get('/me', userAuth,isAdminAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ id: user._id, name: user.name, role: user.role });
});
// GET /api/users/patients
router.get('/patients', userAuth, isAdminAuth, async (req, res) => {
  try {
    // Fetch all users with role 'patient'
    const patients = await User.find({ role: 'patient' });

    if (!patients || patients.length === 0) {
      return res.status(404).json({
        message: 'No patients found',
      });
    }

    res.status(200).json({
      message: 'Patients fetched successfully',
      data: patients,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching patients',
      error: err.message,
    });
  }
});

module.exports=router;