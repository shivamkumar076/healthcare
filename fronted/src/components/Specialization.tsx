import React, { useState } from 'react'
import { Link } from 'react-router-dom';


const Specialization = () => {
   const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  const categories = [
    'Cardiologist',
    'Dermatologists',
    'Pediatrician',
    'Neurologist',
    'Orthopedic Surgeon',
    'Psychiatrist',
    'Gastroenterologist',
    'ENT Specialist',
    'Ophthalmologist',
    'General Physician',
    'Physiotherapist',
    'Dentist',
    'Endocrinologist',
    'Urologist',
    'Nephrologist',
  ];

  const toggleCategories = (): void => {
    setShowAllCategories((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Doctor Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(showAllCategories ? categories : categories.slice(0, 6)).map(
            (category, index) => (
              <Link
                key={index}
                to={`/specialization/${encodeURIComponent(category.replace(/\s+/g, '-'))}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
              >
                <span className="text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                  {category}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            )
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={toggleCategories}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            {showAllCategories ? 'Show Less' : 'Show All Categories'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Specialization

