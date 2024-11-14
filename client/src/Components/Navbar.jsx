import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null); // Initially no user is logged in
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged-in user once on initial load
    const storedUserEmail = localStorage.getItem("userEmail");
    if (storedUserEmail) {
      setUser(storedUserEmail); // Set user if found in local storage
      console.log( storedUserEmail);
    }
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);


  const handleLogin = (email) => {
    // Save email to local storage on login
    localStorage.setItem("userEmail", email);
    setUser(email); // Set user state after login
    navigate("/"); // Redirect to home page after login
  };

  const handleLogout = () => {
    // Clear specific user data instead of clearing all
    localStorage.removeItem("userEmail");
    setUser(null); // Clear user state
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="bg-gray-800 text-white navbar">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="w-34">
          <h3 className="text-xl font-bold">Blog Post</h3>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex w-64 space-x-4">
          <Link to="/" className="text-white hover:text-gray-300 lg:ps-10">
            Home
          </Link>
          {user && (
            <>
              <Link to="/create" className="text-white hover:text-gray-300 lg:ps-10">
                Create
              </Link>
              <Link to="/user" className="text-white hover:text-gray-300 lg:ps-10">
                Users
              </Link>
            </>
          )}
          {!user && (
            <Link to="/contact" className="text-white hover:text-gray-300 lg:ps-10">
              Contact
            </Link>
          )}
        </div>

        {/* Desktop Logout / Login-Register */}
        {user ? (
          <div className="hidden md:flex">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="w-34 hidden md:flex space-x-4">
            <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Register
            </Link>
            <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Login
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4">
          <Link to="/" className="block py-2 text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          {user && (
            <Link to="/create" className="block py-2 text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
              Create
            </Link>
          )}
          <Link to="/user" className="block py-2 text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            User
          </Link>

          {/* Mobile Logout / Login-Register */}
          {user ? (
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <Link
                to="/register"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded block text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded block text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
