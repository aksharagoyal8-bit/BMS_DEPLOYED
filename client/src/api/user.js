import { axiosInstance } from "./index";

export const RegisterUser = async (values) => {
    try {
        const resp = await axiosInstance.post("/api/users/register", values);
        return resp.data;
    }
    catch (err) {
        throw err;
    }
}

export const LoginUser=async (values)=>{
    try{
       const response= await axiosInstance.post("/api/users/login",values);
       return response.data;
    } catch(err){
        console.log(err);
    }
}

export const GetCurrentUser=async ()=>{
    try{
      const response=await axiosInstance.get("/api/users/get-current-user");
      return response.data;
    }
    catch(err){
     console.log(err);
    }
}

const ForgotPassword = async (req, res) => {
  try {
    if (req.body.email === undefined) {
      return res.send({ success: false, message: "E-mail is required" });
    }

    const user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
      return res.send({ success: false, message: "User with this email does not exist" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    try {
      await EmailHelper("otp.html", user.email, { name: user.name, otp: user.otp }, "OTP for BookMyShowclone");
      res.send({ success: true, message: "OTP sent to your email" });
    } catch (emailErr) {
      // ← This will now tell you EXACTLY what's failing
      res.send({ success: false, message: `Email failed: ${emailErr.message}` });
    }

  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const ResetPassword = async (values) => {
  try {
    const response = await axiosInstance.patch(
      `/api/users/reset-password`,
      values
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};