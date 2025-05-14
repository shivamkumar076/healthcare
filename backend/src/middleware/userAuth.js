const jwt=require('jsonwebtoken');
const User=require('../models/user');
const userAuth=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        console.log('token',token)
        if(!token){
            return res.status(401).json({
                message:"token invalid"
            })
             
        }
        const decode= jwt.verify(token,process.env.SECRET_KEY);
        const user=await User.findById(decode._id)
        if(!user){
            return res.status(401).json({message:'invalid user'});
        }
        req.user=user;
next();

    }catch(err){
        console.error( "userautherror",err)
        res.status(500).json({
            message:"user auth error",
            error:err.message
        })
    }

}
function isAdminAuth(req, res, next) {
    if (req.user.role !== 'isAdmin') {
        return res.status(403).json({ message: "Forbidden: Admin access required." });
    }
    next();
}

function isDoctor(req,res,next){
    if(req.user.role !=='doctor'){
        return res.status(403).json({
            message:"Forbidden : doctor access required"
        })
    }
    next()
}
module.exports={userAuth,isDoctor,isAdminAuth};
    