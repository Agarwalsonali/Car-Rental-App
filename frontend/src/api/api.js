import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 15000
})

API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `${token}`;
    }
    return config;
},(error)=>Promise.reject(error));

API.interceptors.response.use((r)=>r,(error)=>{
    if(error?.response?.status==401){
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(error)
})

export default API;