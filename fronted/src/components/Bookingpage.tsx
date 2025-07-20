



import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../utils/store";

// Type definitions
declare global {
  interface Window {
    Razorpay: any;
  }
}

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

interface PaymentResponse {
  amount: number;
  keyId: string;
  currency: string;
  orderId: string;
  notes: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  _id: string;
}

const BookAppointment: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [paymentInProgress, setPaymentInProgress] = useState<boolean>(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axiosInstance.get<{ data: Doctor }>(`/doctor/${doctorId}`);
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
        const res = await axiosInstance.get<string[]>(`/available/${doctorId}/${formattedDate}`);
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

  const initiatePayment = async () => {
    try {
      setPaymentInProgress(true);
      
      // Create payment order
      const paymentRes = await axiosInstance.post<PaymentResponse>("/payment/create", {});
      const { amount, keyId, currency, orderId, notes, _id: paymentId } = paymentRes.data;
      
      // Set up appointment data for later use
      const data = {
        doctorId,
        patientId: user?._id,
        date: selectedDate.toISOString(),
        timeSlot: selectedTimeSlot,
        paymentId: paymentId // Store payment ID to link appointment with payment
      };
      setAppointmentData(data);

      // Configure Razorpay
      const options = {
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "Healthcare+",
        description: "Appointment Booking",
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.email || "",
        },
        theme: {
          color: "#3399cc",
        },
        handler: function (response: any) {
          // Payment successful - now book the appointment
          handlePaymentSuccess(response, data);
        },
        modal: {
          ondismiss: function() {
            setPaymentInProgress(false);
            setError("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setPaymentInProgress(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error initiating payment");
      }
    }
  };

  const handlePaymentSuccess = async (response: any, data: any) => {
    try {
    
      
      // Book appointment
      await axiosInstance.post(`/bookappointment/${doctorId}`, data);
      
      setSuccess("Appointment booked successfully!");
      setSelectedTimeSlot("");
      setPaymentInProgress(false);
      
      // Refresh available slots
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const availableSlotsRes = await axiosInstance.get<string[]>(
        `/available/${doctorId}/${formattedDate}`
      );
      setAvailableTimeSlots(availableSlotsRes.data);
      
      // Navigate to appointments after success
      setTimeout(() => {
        navigate("/appointments");
      }, 2000);
    } catch (err: any) {
      setPaymentInProgress(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error booking appointment after payment");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedTimeSlot) {
      setError("Please select a time slot");
      return;
    }
    if (!user || !user._id) {
    alert("Please login to book an appointment.");   // Optional UX improvement
    navigate("/login");
    return;
  }


    
    // Start payment flow
    initiatePayment();
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
            Book an Appointment with Dr. {doctor.firstName} {doctor.lastName}
          </h2>
          <p className="text-center text-sm sm:text-lg">
            <strong>Specialization:</strong> {doctor.specialization}
          </p>
        </div>

        {error && <div className="text-red-600 text-center my-2">{error}</div>}
        {success && <div className="text-green-600 text-center my-2">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mt-4">
              <h5 className="text-2xl font-bold text-center">
                Choose Date & Time
              </h5>

              <div className="flex-col justify-center mt-5 w-full sm:flex">
                <div className="flex justify-center">
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
                    <div className="text-center text-amber-600 my-3">
                      No available time slots for the selected date
                    </div>
                  ) : (
                    <div className="m-5 flex justify-center max-sm:flex-col gap-2">
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

          <div className="flex flex-col justify-center items-center sm:flex gap-2">
            <p className="mr-2">Click here to proceed with payment and book appointment</p>
            <button
              type="submit"
              className={`px-6 py-3 rounded-md text-white font-medium transition-all duration-200 mb-10 ${
                !selectedTimeSlot || paymentInProgress
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-red-600 hover:bg-red-700 transform hover:scale-105"
              }`}
              disabled={!selectedTimeSlot || paymentInProgress}
            >
              {paymentInProgress ? "Processing..." : "Pay & Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;