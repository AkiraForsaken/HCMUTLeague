import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import './login.css';

const Signin = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleChange = (field) => (e) => {
    setUserData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiURL = 'http://localhost:5000/api/auth/login';

    const payload = {
      username: userData.username,
      password: userData.password,
    };

    try {
      const res = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        const newUser = { username: userData.username, role: result.data.role };
        login(result.data.token, newUser);
        alert('Login successful!');
        navigate('/');
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold text-purple-900 text-center drop-shadow-md">
          Welcome back!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-purple-800">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={userData.username}
                onChange={handleChange('username')}
                placeholder="Type your username here"
                className="mt-1 block w-full px-4 py-2 border border-purple-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-800">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={userData.password}
                onChange={handleChange('password')}
                placeholder="Type your password here"
                className="mt-1 block w-full px-4 py-2 border border-purple-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="text-center text-purple-800">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-purple-600 font-medium hover:text-purple-800 hover:underline transition-colors duration-200"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;