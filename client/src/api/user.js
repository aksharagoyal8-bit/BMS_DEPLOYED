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

export const ForgotPassword = async (values) => {
  try {
    const response = await axiosInstance.patch(
      `/api/users/forgot-password`,
      values
    );
    return response.data;
  } catch (err) {
    console.log(err);
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