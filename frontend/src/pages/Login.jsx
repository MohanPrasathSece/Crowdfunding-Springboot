import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { token, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  return (
        <div className="flex items-center justify-center h-screen bg-black">
            <form onSubmit={handleSubmit} className="border border-gray-700 p-6 rounded w-80 bg-gray-900 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
                    className="p-2 w-full mb-3 border-b bg-transparent border-gray-600 focus:border-orange-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
                    className="p-2 w-full mb-4 border-b bg-transparent border-gray-600 focus:border-orange-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 w-full rounded">
          Login
        </button>
        <p className="text-sm text-center mt-3">
          Don't have an account?{' '}
                    <Link to="/signup" className="text-orange-500 hover:text-orange-400">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
