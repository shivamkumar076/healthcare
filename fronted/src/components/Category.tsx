import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';

interface Doctor {
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    specialization: string;
    aboutdoctor: string;
    image: string;
    _id: string;
}

const Category = () => {
    const { specialization } = useParams<{ specialization: string }>();
    const [doctors, setDoctors] = useState<Doctor[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get<{ data: Doctor[] }>(
                `/specialization/${specialization}`
            );
            
            setDoctors(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (specialization) {
            fetchData();
        }
    }, [specialization]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!doctors || doctors.length === 0) {
        return <div>No doctors found.</div>;
    }

    return  (
        <div className="">
          <ul className=" grid-cols-1 gap-1 sm:flex w-full  ">
            {doctors?.map((doc) => (
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

export default Category;