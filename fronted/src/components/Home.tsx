import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';

const Home: React.FC = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col">
      {!hideNavbar && <Navbar />}
      
      <main className="flex-1">
       
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;