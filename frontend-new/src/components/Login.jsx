import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import {ToastContainer, toast } from 'react-toastify';

const Login = ({setShowLogin}) => {
    const navigate = useNavigate();
    const [state, setState] = React.useState("login");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setlastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e)=>{
        e.preventDefault();
    }

    const registerHander = async()=>{
       try {
         const res =  await axios.post("http://localhost:3000/api/auth/register",{
            firstName,
            lastName,
            email,password
        });

        if(res.data.token){
            localStorage.setItem("token",res.data.token);
            localStorage.setItem("userId",res.data.userId);
            toast.success("Register successfully");
            navigate("/")
            return;
        }


       } catch (error) {
            toast.error("Error while registering")
       }
    }

    const loginHandler =async ()=>{
        try {
            const res = await axios.post("http://localhost:3000/api/auth/login",{
                email,
                password
            })

            if(res.data.token){
                if(!localStorage.getItem("token")){
                    localStorage.setItem("token",res.data.token);
                    localStorage.setItem("userId",res.data.userId);
                }
                toast.success(res.data.message);
                setTimeout(() => {
                    window.location.reload();
                    
                }, 1500);
                return ;
            }


        } catch (error) {
            toast.error("Signin fail");
        }
    }

  return (
    <div onClick={()=>setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>
      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Firstname</p>
                    <input onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                   <div className='w-full mt-5'>
                     <p>Lastname</p>
                    <input onChange={(e) => setlastName(e.target.value)} value={lastName} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
              
                   </div>
                    
                </div>
                
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <button onClick={state == "register" ? registerHander: loginHandler} className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
        <ToastContainer/>
    </div>
  )
}

export default Login
