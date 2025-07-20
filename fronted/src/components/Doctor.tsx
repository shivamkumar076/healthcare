import { useEffect } from "react";
import { adddoctor } from "../utils/doctorSlice";
import axiosInstance from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../utils/store";
import { Link } from "react-router-dom";

interface doctor {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  specialization: string;
  aboutdoctor: string;
  image: string;
  _id: string;
}

const Doctor = () => {
  const dispatch = useDispatch();
  const doctor = useSelector((store: RootState) => store.doctor);
  console.log(doctor);
  const fetchdata = async () => {
    const res = await axiosInstance.get<{ data: doctor[] }>("/alldoctor");
    console.log(res?.data?.data);
    dispatch(adddoctor(res.data.data));
  };
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="">
      <ul className=" grid-cols-1 gap-1 sm:flex w-full  ">
        {doctor?.map((doc) => (
          <li key={doc._id}>
          <div className=" p-4 shadow-md rounded-2xl m-4 h-fit bg-blue-400  cursor-pointer  transition-transform duration-300 hover:scale-105  " >
                 <Link className="" to={`/doctor/${doc._id}`}>
              <div className=" w-full">
              <img
                className="w-full  shadow-md rounded-2xl"
                src={`http://localhost:4000/${doc ? doc.image : ""}`}
                alt={doc ? doc.firstName : ""}
              />
              <h1  className="text-2xl font-semibold pt-2  text-white text-center">{doc.firstName}</h1>
              <p className="text-sm text-center text-white">{doc.specialization}</p>

         
            </div>
            </Link>
          </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Doctor;
