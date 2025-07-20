import { useEffect, useState } from "react";
import { FaUserMd, FaCalendarAlt, FaUsers, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
  interface Doctor {
  id: string;
  firstName: string;
  lastName:string;
  specialization: string;
  image:string
}

interface Patient {
  id: string;
  firstName: string;
  lastName:string;
    age: number;
}
const Dashbord = () => {
     const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

const fetchdata=async()=>{
  const doctorlist=await axiosInstance.get<{data:Doctor[]}>('alldoctor');
  console.log(doctorlist)
  setDoctors(doctorlist.data.data);

}

const fetchpatientdata=async()=>{
  const patientList=await axiosInstance.get<{data:Patient[]}>('patients');
  console.log(patientList)
  setPatients(patientList.data.data);

}





useEffect(()=>{
fetchdata();
fetchpatientdata();
},[])
  return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Navbar */}
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">DocPanel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-blue-600">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white shadow-md p-4 md:p-4`}
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-8 hidden md:block">DocPanel</h2>
        <nav className="flex flex-col gap-4">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
              activeTab === "dashboard" ? "bg-blue-200" : ""
            }`}
          >
            <FaCalendarAlt /> Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab("doctors");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
              activeTab === "doctors" ? "bg-blue-200" : ""
            }`}
          >
            <FaUserMd /> Doctors
          </button>
          <button
            onClick={() => {
              setActiveTab("patients");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
              activeTab === "patients" ? "bg-blue-200" : ""
            }`}
          >
            <FaUsers /> Patients
          </button>
          <button
            onClick={() => {
              setActiveTab("settings");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
              activeTab === "settings" ? "bg-blue-200" : ""
            }`}
          >
            <FaCog /> Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 capitalize">{activeTab}</h1>
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">Appointments: 120</div>
            <div className="bg-white p-4 rounded shadow">Doctors: {doctors.length}</div>
            <div className="bg-white p-4 rounded shadow">Patients: {patients.length}</div>
          </div>
        )}
        {activeTab === "doctors" && (
          <div className="grid gap-4">
            <Link className="bg-blue-700 p-2 text-white font-bold w-28 text-center" to={'/admin/doctorregister'}>Add Doctor</Link>
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg">{doc.firstName}</h2>
                <p className="text-gray-600">Specialization: {doc.specialization}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "patients" && (
          <div className="grid gap-4">
            {patients.map((pat) => (
              <div key={pat.id} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg">{pat.firstName}</h2>
                <p className="text-gray-600"> {pat.lastName}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "settings" && <div>Settings and Preferences</div>}
      </div>
    </div>
  );
}
 
export default Dashbord