import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Home from './Home';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validate = () => {
    const errors = {};
    if (name.trim() === '') {
      errors.name = 'Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      errors.name = 'Name should contain only letters';
    }
    if (email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (password.trim() === '') {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password should be at least 6 characters long';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const userData = { name, email, password };
      try {
        const response = await fetch('http://localhost:5002/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (response.ok) {
          setName('');
          setEmail('');
          setPassword('');
          setMessage('Sign-up successful!');
          setIsAuthenticated(true);
        } else {
          setMessage(data.msg || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        setMessage('Error: Unable to connect to the server. Please try again later.');
      }
    }
  };

  if (isAuthenticated) {
    return <Home />;
  }

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800" >Sign Up</h1>
        {message && (
          <p
            className={`text-center ${
              message.includes('successful') ? 'text-green-600' : 'text-red-600'
            } mb-4`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" >
          <div>
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className={`w-full px-3 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 ${
                errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className={`w-full px-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none focus:ring-2 ${
                errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>

          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
