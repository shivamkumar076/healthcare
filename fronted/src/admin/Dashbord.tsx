import { useState } from "react";
import { FaUserMd, FaCalendarAlt, FaUsers, FaCog } from "react-icons/fa";
  interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
}
const Dashbord = () => {
     const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([
    { id: "1", name: "John Doe", age: 30 },
    { id: "2", name: "Jane Smith", age: 25 },
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: "1", name: "Dr. Alice", specialization: "Cardiology" },
    { id: "2", name: "Dr. Bob", specialization: "Neurology" },
  ]);
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
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg">{doc.name}</h2>
                <p className="text-gray-600">Specialization: {doc.specialization}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "patients" && (
          <div className="grid gap-4">
            {patients.map((pat) => (
              <div key={pat.id} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg">{pat.name}</h2>
                <p className="text-gray-600">Age: {pat.age}</p>
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