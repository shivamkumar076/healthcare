import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

import About from "./components/About";
import { store } from "./utils/store";
import { Provider } from "react-redux";
import Dashbord from "./admin/Dashbord";
import AuthGaurd from "./components/AuthGaurd";
import Doctor from "./components/Doctor";
import Doctorbyid from "./components/Doctorbyid";
import BookAppointment from "./components/Bookingpage";
import Specialization from "./components/Specialization";
import Category from "./components/Category";
import ContactUs from "./components/ContactUs";
import TermsAndCondition from "./components/TermsAndCondition";
import Landingpage from "./components/Landingpage";
import Doctoradd from "./admin/Doctoradd";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* public route  */}
          <Route path="/" element={<Home />}>
          <Route index element={<Landingpage />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/alldoctors" element={<Doctor />}></Route>
            <Route path="/doctor/:id" element={<Doctorbyid />}></Route>
            <Route
              path="/bookappointment/:doctorId"
              element={<BookAppointment />}
            ></Route>
            <Route path="/specialization" element={<Specialization />}></Route>
            <Route
              path="/specialization/:specialization"
              element={<Category />}
            ></Route>

            <Route path="/contactus" element={<ContactUs />}></Route>
            <Route
              path="/termsandcondition"
              element={<TermsAndCondition />}
            ></Route>

            {/* admin route  */}
            <Route element={<AuthGaurd allowrole="isAdmin" />}>
              <Route path="/admin" element={<Dashbord />}></Route>
             <Route path="/admin/doctorregister" element={<Doctoradd />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
