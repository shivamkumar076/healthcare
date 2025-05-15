import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-4 text-white text-center">
        <div>
            <ul className='flex justify-center m-2'>
                <li><Link className=' mx-2 font-light hover:text-blue-700' to={'/contactus'}>ContactUs</Link></li>
                 <li><Link className=' mx-2 font-light hover:text-blue-700' to={'/about'}>About</Link></li>
                  <li><Link className=' font-light hover:text-blue-700' to={'/termsandcondition'}>Terms and Condiiton</Link></li>
            </ul>
        </div>
      <p className="text-sm text-gray-200">© 2025 Healthcare+. All rights reserved. By shivam kumar</p>
    </footer>
  );
};

export default Footer;