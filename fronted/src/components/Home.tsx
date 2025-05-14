import Navbar from "./Navbar"
import { Outlet,useLocation } from "react-router-dom"


const Home = () => {
  const location=useLocation();
    const hideNavbar = location.pathname.startsWith('/admin');
  return (
    <div>
        {!hideNavbar && <Navbar/>}
        <Outlet/>

        
    </div>
  )
}

export default Home