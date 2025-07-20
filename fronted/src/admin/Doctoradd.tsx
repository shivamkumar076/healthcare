import { useState } from "react";
import axiosInstance from "../api/axios";

const DoctorAdd = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [aboutDoctor, setAboutDoctor] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("specialization", specialization);
    formData.append("aboutdoctor", aboutDoctor);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axiosInstance.post("/doctorregister", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data || "Doctor registered successfully!");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
        "An error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-3xl text-center m-10">Doctor Registration</h1>
      <div className="flex justify-center my-10">
        <div className="flex flex-col w-80 shadow-2xl shadow-blue-700 p-10 rounded-lg">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="p-1 my-1 border rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="p-1 my-1 border rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="firstname">First Name</label>
          <input
            id="firstname"
            className="p-1 my-1 border rounded"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            className="p-1 my-1 border rounded"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="specialization">Specialization</label>
          <select
            id="specialization"
            className="p-1 my-1 border rounded"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">-- Select Specialization --</option>
            <option value="cardiologist">Cardiologist</option>
            <option value="dermatologist">Dermatologist</option>
            <option value="neurologist">Neurologist</option>
            <option value="orthopedic surgeon">Orthopedic Surgeon</option>
            <option value="psychiatrist">Psychiatrist</option>
            <option value="gastroenterologist">Gastroenterologist</option>
            <option value="ent specialist">ENT Specialist</option>
            <option value="ophthalmologist">Ophthalmologist</option>
            <option value="general physician">General Physician</option>
            <option value="physiotherapy">Physiotherapy</option>
            <option value="dentist">Dentist</option>
            <option value="endocrinologist">Endocrinologist</option>
            <option value="urologist">Urologist</option>
            <option value="nephrologist">Nephrologist</option>
          </select>

          <label htmlFor="aboutdoctor">About Doctor</label>
          <input
            id="aboutdoctor"
            className="p-1 my-1 border rounded"
            type="text"
            value={aboutDoctor}
            onChange={(e) => setAboutDoctor(e.target.value)}
          />

          <label htmlFor="image">Profile Picture</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 disabled:bg-blue-300"
            onClick={handleSubmit}
            disabled={loading}
            type="button"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAdd;