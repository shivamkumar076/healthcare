import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useEffect, useState } from "react";


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

const Doctorbyid = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<doctor | null>(null);

  const fetchdata = async () => {
    try {
      const response = await axiosInstance.get<{ data: doctor }>(
        `/doctor/${id}`
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching doctor:", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div>
      {data ? (
        <div key={data._id} className="flex p-7 m-5 shadow-md bg-gray-100 shadow-blue-300 rounded-3xl max-sm:flex-col  ">
          
          <div className="">
            <img
              className="w-60 h-60 shadow-md rounded-2xl"
              src={`http://localhost:4000/${data.image}`}
              alt={data.firstName}
            />
          </div>
          <div className="mx-5 flex flex-col gap-2 max-sm:pt-5 ">
            <h1 className="text-2xl font-bold max-sm:xl ">
              {data.firstName} {data.lastName}
            </h1>
            <p> Spealization : {data.specialization}</p>
            <p> About : {data.aboutdoctor}</p>
            <div className="my-20 mx-5 bg-blue-500 w-fit p-2 rounded-2xl max-sm:my-7">
       <Link to={`/bookappointment/${data._id}`}>Book Appointment</Link>
            </div>
       
          </div>

        
        </div>
      ) : (
        <p>Loading doctor info...</p>
      )}
    </div>
  );
};

export default Doctorbyid;
