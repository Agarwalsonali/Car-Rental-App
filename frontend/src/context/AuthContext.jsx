import { createContext, useEffect, useState } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [token,setToken] = useState(()=> localStorage.getItem("token"));
    const [loading,setLoading] = useState(false);
    const [user,setUser] = useState(null);

    useEffect(()=>{
        if(token){
            (async()=>{
                try{
                    setLoading(true);
                    const res = await API.get('/auth/me',{
                        headers:{
                            Authorization:token
                        }
                    });
                    setUser(res.data);
                }catch(err){
                    console.warn("Auth: cannot fetch profile.");
                }finally{
                    setLoading(false);
                }
            })();
        }
        else{
            setUser(null);
        }
    },[token]);

    const login = async(email,password)=>{
        const res = await API.post('/auth/login',{email,password});
        const t = res.data.token;
        localStorage.setItem('token',t);
        setToken(t);
        return res.data;
    }

    const register = async(payload)=>{
        const res = await API.post('/auth/register',payload);

        if(res.data?.token){
            localStorage.setItem('token',res.data.token);
            setToken(res.data.token);
        }
        return res.data;
    };

    const logout = ()=>{
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{token,user,loading,login,logout,register}}>
            {children}
        </AuthContext.Provider>
    );
    
}