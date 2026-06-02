const router=require("express").Router();
const {createuser, readuser, getCurrentUser,forgotPassword,resetPassword} = require("../controllers/usercontroller");
const authMiddleware=require("../middlewares/authMiddleware");
const userModel=require("../models/usermodels")

router.post('/register',createuser);
router.post("/login",readuser)

router.get("/get-current-user",authMiddleware,getCurrentUser);
router.patch("/forgot-password",forgotPassword);
router.patch("/reset-password",resetPassword);


module.exports=router;