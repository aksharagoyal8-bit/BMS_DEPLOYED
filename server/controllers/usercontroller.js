const jwt=require("jsonwebtoken");
const usermodel=require("../models/usermodels");
const EmailHelper = require("../utils/emailHelper");
const bcrypt=require("bcrypt");

const createuser=async function (req,res) {
    try{
      const userExists=await usermodel.findOne({email:req.body.email});
      if(userExists){
        return res.send({
          success:false,
          message:"User already registered"

        });
      }
      const newuser=await usermodel(req.body);
      const saltRounds=10;
      const hashedPassword=await bcrypt.hash(req.body.password,saltRounds);
       newuser.password=hashedPassword;

     
      await newuser.save();
      res.send({success:true,message:"Registration successfull, please Login "});
    }
    catch(err){
        console.log(err);
          res.send({
           success:false,
        message:"An error occured, please try again later"});
    }
}
const readuser= async function (req,res) {
    try{
     const user=await usermodel.findOne({email:req.body.email});
     if(!user){
        return res.send({
            success:false,
            message:"User does not exist, Please register",

        })
     }
     const isMatch=await bcrypt.compare(req.body.password,user.password);


     if(!isMatch){
        return res.send({
         success:false,
        message:"Invalid Password",
        })
      
     }

      const token=jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
    console.log(token);
     res.send({
        success:true,
        message:"Login successfull",
        data:token,
     })



    }
    catch(err){
        console.log(err);
        res.send({
           success:false,
        message:"An error occured, please try again later"});
    }
    
}

const getCurrentUser=async(req,res)=>{
    try{
         const userId = req.user.userId;
        const user=await usermodel.findById(userId).select("-password");
        res.send({
            success:true,
            message:"You are Authenticated",
            data:user,
        });
    }catch(err){
        res.send({
            success:false,
            message:err.message,
        });
    }
 
}

const generateOtp=()=>{
    const otp=Math.floor(Math.random()*100000)+90000;
    return otp;
}
const forgotPassword=async(req,res)=>{
    try{
      if(req.body.email===undefined){
        return res.send({
            success:false,
            message:"E-mail is required",

        });
    }
    const user=await usermodel.findOne({email:req.body.email});
    if(!user){
        return res.send({
            success:false,
            message:"User with this email does not exist",
        })
    }
    const otp=generateOtp();
    user.otp=otp;
    user.otpExpiry=Date.now()+5*60*1000;
    await user.save();
    res.send({
        success:true,
        message:"OTP sent to your email",
    })
    await EmailHelper("otp.html",user.email,{name:user.name,otp:user.otp},"OTP for BookMyShowclone")
    }catch(err){
        res.send({
            success:false,
            message:err.message,
        });
    }
 
}
const resetPassword=async(req,res)=>{
    try{
     const resetDetails=req.body;
     if(!resetDetails.password|| !resetDetails.otp){
        res.send({
            success:false,
            message:"Password and OTP are required"
        })
     }
     const user=await usermodel.findOne({otp:resetDetails.otp});
     if(!user){
        return res.send({
            success:false,
            message:"Invalid OTP"
        })
     }
     if(user.otpExpiry<Date.now()){
        return res.send({
            success:false,
            message:"OTP has expired"
        })
     }

     const saltRounds = 10;
const hashedPassword = await bcrypt.hash(resetDetails.password, saltRounds);
user.password = hashedPassword;
     user.otp=undefined;
     user.otpExpiry=undefined;
     await user.save();
     res.send({
        success:true,
        message:"Password reset successful"
     })
    }catch(err){
        res.send({
            success:false,
            message:err.message,
        });
    }
}

module.exports={createuser,readuser,getCurrentUser,forgotPassword,resetPassword};