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
    message:string
    _id:string
}
const Register = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
const [error, setError] = useState<string>('');
  const onhandlesubmit=async ()=>{
    try{
 const res=await axiosInstance.post<{data:User}>('/register',{
      firstName,
      lastName,
      email,
      password
    });
    if(res.data){
      document.cookie=`token=${res.data.data.token}`
      dispatch(adduser(res.data.data));
      navigate('/')
    }
  
    }catch(err: any){
      setError(err.response?.data?.message || "An unexpected error occurred")

    }
   
  }
  return (
    <div className="flex justify-center  w-full  ">
    
     
      <div className="p-10  mt-7     rounded-2xl shadow-md shadow-blue-500 w-full m-5 sm:w-2/3 md:w-1/4 ">
        <h1 className="text-center  pb-5  text-2xl font-semibold">Patient Registration</h1>
        <input
          type="text"
          className="border border-gray-300 p-2 text-black w-full mb-4"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          className="border border-gray-300 p-2 w-full"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-4 mt-4 border-gray-300 " onChange={e=>setEmail(e.target.value)}  />
        <input type="password" placeholder="password" className="border w-full p-2  border-gray-300" onChange={e=>setPassword(e.target.value)} /> 
       {
        error && <p>{error}</p>
       }
       <button onClick={onhandlesubmit} className="bg-blue-600 text-white w-full hover:cursor-pointer p-2 rounded-2xl mt-5 mb-2">Register</button>
       <p className="text-sm  p-2">Already have Account : <a href="/login" className="text-blue-700">Login</a> </p>
      </div>
    </div>
  );
};

export default Register;
