const validatedata=(req)=>{
    const {email,password,firstName,lastName}=req.body;
    if(!email || !password){
        throw new Error("please enter email password")
    }
    if(!firstName || !lastName){
        throw new Error('please enter firstname and lastname')
    }

}
module.exports={validatedata};