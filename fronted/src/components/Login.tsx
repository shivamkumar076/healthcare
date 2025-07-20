import { useState } from "react";
import axiosInstance from "../api/axios";
import {adduser} from '../utils/authSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
 interface User{
    email:string,
    role:string,
    firstName:string,
    lastName:string,
    token:string,
    message:string,
    _id:string
}
const Login = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate()
 
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
const [error, setError] = useState<string>('');
  const onhandlesubmit=async ()=>{
    try{
 const res=await axiosInstance.post<{data:User}>('/login',{
      
      email,
      password
    });
    dispatch(adduser(res.data.data));
        if (res.data.data.role === 'isAdmin') {
      navigate('/admin');
    } else if (res.data.data.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else if (res.data.data.role) {
      navigate('/');
    }
    }catch(err){
      setError(err?.response?.data?.message || "An unexpected error occurred")

    }
   
  }
  return (
    <div className="flex justify-center w-full   ">
    {/* w-1/4 max-sm:w-full m-5 */}
     
      <div className="p-5  mt-10 rounded-2xl shadow-md shadow-blue-500 w-full m-5 sm:w-2/3 md:w-1/4  ">
        <h1 className="text-center  pb-5  text-2xl font-semibold">Login</h1>
       
        <input type="email" placeholder="Email" className="border border-gray-300 p-2 w-full mb-4 mt-4 " onChange={e=>setEmail(e.target.value)}  />
        <input type="password" placeholder="password" className="border border-gray-300 w-full p-2 " onChange={e=>setPassword(e.target.value)} /> 
       {
        error && <p>{error}</p>
       }
       <button onClick={onhandlesubmit} className="bg-blue-600 text-white w-full hover:cursor-pointer p-2 rounded-2xl mt-5 mb-2 font-bold">Login</button>
       <p className="text-sm  p-2">Create a new Account : <a href="/register" className="text-blue-700">Register</a> </p>
      </div>
    </div>
  );
};

export default Login;
