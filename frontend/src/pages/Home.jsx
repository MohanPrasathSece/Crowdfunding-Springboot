import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-black text-center text-white">
      
        
      
      
        
      
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-poppins">Empower Ideas, Fuel Dreams</h1>
      <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-poppins">Kick-start your projects with support from backers worldwide.</p>
      <div className="space-x-4">
                <Link to="/create" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold">
          Start a Campaign
        </Link>
                <Link to="/explore" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded font-semibold">
          Explore Projects
        </Link>
      </div>
    </section>
  );
};

export default Home;
