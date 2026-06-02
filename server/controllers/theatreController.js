const theatreModel=require("../models/theatreModel");




const addTheatre=async(req,res)=>{
    try{
        const newTheatre=new theatreModel(req.body);
        await newTheatre.save();
        res.send({
            success:true,
            message:"Theatre saved successfully",
        })
    }
    catch(err){
        res.send({
            success:false,
            message:err.message,
        })
    }
}

const updateTheatre=async(req,res)=>{
  try{
            const body=req.body;
            const theatreId=body.id;
            const theatre=await theatreModel.findById(theatreId);
    
            Object.keys(body).forEach((key)=>{
             if(key!=="id")theatre[key]=body[key];
            })
            await theatre.save();
            res.send({
                success:true,
                message:"Theatre has been updated successfully",
                data:theatre,

            })
        }
        catch(err){
    res.send({
     success:false,
    message:err.message,
    })
    
  }
}
const deleteTheatre=async (req,res)=>{
try{
await theatreModel.findByIdAndDelete(req.body.id);
res.send({
success:true,
message:"Theatre has been deleted",
})
}
catch(err){
    res.send({
     success:false,
    message:err.message,
    })
   
}
}
const getAllTheatre=async(req,res)=>{
    try{
    const allTheatres=await theatreModel.find().populate('owner');
    res.send({
        success:true,
        message:"All theatres have been fetched",
        data:allTheatres,
    })
    }
    catch(err){
        res.send({
            success:false,
            message:err.message,
        })
    }
}
const getTheatreByOwner=async(req,res)=>{
    try{
     const ownerId=req.body.ownerId;
     const filteredTheatreByOwner=await theatreModel.find({owner:ownerId});
     res.send({
        success:true,
        message:"Theatre of owner fetched",
        data:filteredTheatreByOwner,

     })
    }catch(err){
        res.send({
            success:false,
            message:err.message,
        })
    }
}

module.exports={addTheatre,updateTheatre,deleteTheatre,getAllTheatre,getTheatreByOwner};