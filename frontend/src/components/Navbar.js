import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
        <nav className="bg-black border-b border-gray-700 shadow p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-orange-500">
          CrowdfundIt
        </Link>
        <div className="space-x-4 text-sm">
          <Link to="/explore">Explore</Link>
          {token && <Link to="/create">Create</Link>}
          
          
          {token ? (
                        <button onClick={logout} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded">
              Logout
            </button>
          ) : (
            <>
              <Link className="hover:text-orange-500" to="/login">Login</Link>
              <Link className="hover:text-orange-500" to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
