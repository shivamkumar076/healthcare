import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../utils/store";

// Type definitions
interface doctor {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  specialization: string;
  aboutdoctor: String;
  image: String;
  _id: string;
}

const BookAppointment: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const user = useSelector((store: RootState) => store.user);

  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axiosInstance.get<{ data: doctor }>(
          `/doctor/${doctorId}`
        );

        setDoctor(res.data.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching doctor details");
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    const fetchAvailableTimeSlots = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const res = await axiosInstance.get<string[]>(
          `/available/${doctorId}/${formattedDate}`
        );
        setAvailableTimeSlots(res.data);
        setError("");
      } catch (err) {
        setError("Error fetching available time slots");
        setAvailableTimeSlots([]);
      }
    };

    fetchAvailableTimeSlots();
  }, [doctorId, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot("");
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTimeSlot) {
      setError("Please select a time slot");
      return;
    }

    try {
      const appointmentData = {
        doctorId,
        patientId: user?._id,
        date: selectedDate.toISOString(),
        timeSlot: selectedTimeSlot,
      };

      await axiosInstance.post(`/bookappointment/${doctorId}`, appointmentData);

      setSuccess("Appointment booked successfully!");

      setSelectedTimeSlot("");

      setTimeout(() => {
        navigate("/appointments");
      }, 2000);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error booking appointment");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="alert alert-danger">Doctor not found</div>;
  }

  return (
    <div className="">
      <div className="">
        <div className="bg-blue-200 p-5 border-gray-300">
          <h2 className="mb-4 text-center text-lg my-5 font-semibold sm:text-2xl md:text-4xl">
            Book an Appointment with . {doctor.firstName} {doctor.lastName}
          </h2>
          <p className="text-center text-sm sm:text-lg">
            <strong>Specialization:</strong> {doctor.specialization}
          </p>
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className=" mb-4">
            <div className="mt-4 ">
              <h5 className="text-2xl font-bold text-center ">
                Choose Date & Time
              </h5>

              <div className="flex-col   justify-center mt-5  w-full sm:flex  ">
               <div   className="flex justify-center">
 <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) =>
                    date && handleDateChange(date)
                  }
                  minDate={new Date()}
                
                  dateFormat="MMMM d, yyyy"
                  inline
                />
             
               </div>
                
                <div className="mt-5">
                  <h6 className="text-center text-2xl">
                    Available Time Slots:
                  </h6>
                  {availableTimeSlots.length === 0 ? (
                    <div className="alert alert-info">
                      No available time slots for the selected date
                    </div>
                  ) : (
                    <div className="m-5 flex justify-center max-sm:flex-col gap-2 ">
                      {availableTimeSlots.map((timeSlot) => (
                        <div
                          key={timeSlot}
                          className={`py-2 px-2 mx-2 rounded-md transition-all duration-200 focus:outline-none text-center ${
                            selectedTimeSlot === timeSlot
                              ? "bg-blue-600 text-white shadow-md transform scale-105"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }`}
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                          style={{ cursor: "pointer" }}
                        >
                          {timeSlot}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" flex flex-col justify-center items-center sm:flex gap-2">
            <p className="mr-2">click here book Appointment</p>
            <button
              type="submit"
              className={`px-6 py-3 rounded-md text-white font-medium transition-all duration-200 mb-10 ${
                !selectedTimeSlot
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-red-600 hover:bg-red-700 transform hover:scale-105"
              }`}
              disabled={!selectedTimeSlot}
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
