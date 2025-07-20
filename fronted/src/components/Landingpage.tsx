

const Landingpage = () => {
  return (
    <section className="min-h-screen px-4 py-12 md:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-center">
      <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Serving Your <br />
          Health Needs is <br />
          Our Priority.
        </h1>
        <p className="mt-4 text-sm md:text-base text-gray-700 max-w-md mx-auto md:mx-0">
          There is nothing more important than our good health, that's our principle capital asset for our good future.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
          <a
            className="bg-blue-700 text-white px-6 py-2 rounded-sm"
            href="/alldoctors"
          >
            Make Appointment
          </a>
          <a
            className="bg-blue-700 text-white px-6 py-2 rounded-sm"
            href="/contactus"
          >
            Contact Us
          </a>
        </div>
      </div>

      <div className="md:w-1/2 flex justify-center">
        <img
          src="images/doctor.jpg"
          alt="Doctor"
          className="max-w-full h-auto rounded-lg shadow-lg"
          style={{ maxHeight: '600px' }}
        />
      </div>
    </section>
  );
};

export default Landingpage;