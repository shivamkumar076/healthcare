import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../utils/store'; // Adjust the path to your store file
import { persistor } from '../utils/store'; // Adjust the path to your store file
import axiosInstance from '../api/axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

  import { removeUser } from '../utils/authSlice';
const Navbar: React.FC = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const handleLogout=async ()=>{
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      if(token){
          await axiosInstance.post("/logout",{})
    
  
      }
      dispatch(removeUser(null)); // Pass the appropriate payload, e.g., null if no payload is needed
      localStorage.clear();
          persistor.purge();
          navigate('/')
      };
      

  return (
    <nav className="w-full bg-white shadow-md px-7 py-5 flex justify-between items-center relative">
      {/* Logo */}
      <Link className="text-3xl font-bold text-blue-600" to={'/'}>
      Healthcare+
      </Link>
   

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex gap-6 text-gray-700">
        <Link to="/alldoctors" className="hover:text-blue-500 text-lg font-semibold transition  duration-300">All Doctors</Link>
        <Link to="/about" className="hover:text-blue-500 transition duration-300 font-semibold text-lg">About</Link>
        <Link to="/specialization" className="hover:text-blue-500 transition duration-300 text-lg font-semibold">Specialization</Link>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:block">
        {!user ? (
          <div className="flex gap-2">
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Hello, {user.firstName}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50">
          <Link 
            to="/alldoctors" 
            className="hover:text-blue-500 transition duration-300 py-2 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            All Doctors
          </Link>
          <Link 
            to="/about" 
            className="hover:text-blue-500 transition duration-300 py-2 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/specialization" 
            className="hover:text-blue-500 transition duration-300 py-2 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            Specialization
          </Link>
          
          {!user ? (
            <div className="flex flex-col gap-2 w-full px-4 mt-2">
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full px-4 mt-2">
              <span className="text-gray-700">Hello, {user.firstName}</span>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 w-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>)
};

export default Navbar;
