// src/components/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importing react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing toastify styles

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    // Check if username is provided
    if (!username) {
      toast.error("Username is required!");
      return false;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email || !emailPattern.test(email)) {
      toast.error("Please enter a valid email address!");
      return false;
    }

    // Validate password (4 letters and 4 numbers, total 8 characters)
    const passwordPattern = /^(?=.*[a-zA-Z]{4})(?=.*\d{4})[a-zA-Z\d]{8}$/;
    if (!password || !passwordPattern.test(password)) {
      toast.error("Password must be 8 characters, including at least 4 letters and 4 numbers!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // First validate the form
    if (!validateForm()) {
      return;
    }

    // If form is valid, submit data
    axios.post('http://localhost:3001/register', { username, email, password })
    .then(res => {
      toast.success("Registration successful!"); // Show success toast

      // Wait for the toast to show before navigating
      setTimeout(() => {
        navigate('/login'); // Redirect to login page
      }, 2000); // Delay of 2 seconds (adjust the time as needed)
    })
      .catch(err => {
        toast.error("Error registering! Please try again."); // Show error toast
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Register</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              onChange={e => setUsername(e.target.value)} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              onChange={e => setEmail(e.target.value)} />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              onChange={e => setPassword(e.target.value)} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
          >
            Register
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-gray-800 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Register;
