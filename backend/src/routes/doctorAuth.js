const express=require('express');
const router=express.Router();
const {validatedata} = require('../utils/validation');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const multer=require('multer')
const { userAuth, isAdminAuth } = require('../middleware/userAuth');

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

router.post("/doctorregister", userAuth, isAdminAuth, upload.single("image"), async (req, res) => {
    try {
        validatedata(req);
        const { email, password, firstName, lastName, specialization, aboutdoctor } = req.body;
        const image = req.file?.path;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const data = new User({
            email,
            firstName,
            lastName,
            password: hashPassword,
            specialization,
            aboutdoctor,
            image,
            role:'doctor',
        });

        const savedata = await data.save();
        const token = await data.getJWT(); // Call instance method here

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict"
        });

        res.status(201).json({
            message: "Registration successful",
            data: savedata,
        });
    } catch (err) {
        console.error("doctor register error")
        res.status(500).json({
            message: "Registration failed",
            error: err.message,
        });
    }
});
router.patch("/doctorupdateprofile", userAuth, isAdminAuth, upload.single("image"), async (req, res) => {
    try {
        validatedata(req);
        const { email, password, firstName, lastName, specialization, aboutdoctor } = req.body;
        const image = req.file?.path;
        const id =req.params.id

        const user = await User.findOne({ _id:id });
        if (!user) {
            return res.status(409).json({ message: "User not exists add doctor" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const data = new User({
            email,
            firstName,
            lastName,
            password: hashPassword,
            specialization,
            image,
            aboutdoctor,
            role:'doctor',
        });

        const savedata = await data.save();
        const token = await data.getJWT(); 

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict"
        });

        res.status(201).json({
            message: "Update successfully",
            data: savedata,
        });
    } catch (err) {
        res.status(500).json({
            message: "Update failed",
            error: err.message,
        });
    }
});

router.get('/alldoctor',async(req,res)=>{
    try{
        const doctors=await User.find({role:'doctor'}).select('-password')
        res.status(200).json({
            message:"fetch data successfully",
          
            data:doctors
        })
    }catch(err){
        res.status(500).json({
            message:"all doctor fetch error",
            error:err.message
        })
    }
})
router.get('/doctor/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        const fetchdoctor=await User.findById({_id:id}).select('-password');
        if(!fetchdoctor){
           res.status(401).json({
            message:"doctor data not available"
          
        })

        }
        res.status(200).json({
            message:"data fetch succesfully",
            data:fetchdoctor
        })

    }catch(err){
        res.status(500).json({
        message:"doctor fetch error",
        error:err.message
    
        })
    }
       
});


router.get('/specialization/:specialization', async (req, res) => {
  try {
    const {specialization} = req.params;
    const fetchdoctor = await User.find({
      specialization: specialization,
      role: "doctor"
    });
    
    if (!fetchdoctor.length) {
      return res.status(404).json({
        message: "No doctors found with this specialization"
      });
    }
    
    return res.status(200).json({
      message: "Doctors fetched successfully",
      data: fetchdoctor
    });
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      message: err.message
    });
  }
});

router.delete('/deletedoctor/:id',userAuth, isAdminAuth,async()=>{
    try{
        const id=req.params.id;
        const data=User.findByIdAndDelete(id)
        res.status(200).json({
            message:"doctor delete successfully"
        });

    }catch(err){
        res.status(401).json({
            message:"delete error"
        })
    }
})

module.exports=router;