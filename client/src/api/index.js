import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    }
});

axiosInstance.interceptors.request.use(
   function(config){

      const token = localStorage.getItem("token");

      if(token){
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },

   function(error){
      return Promise.reject(error);
   }
);