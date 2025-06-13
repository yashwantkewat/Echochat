import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-dark text-white p-4 fixed w-full z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">EchoAI</Link>

        {/* Mobile Menu Button */}
        <button
          className="text-white lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Navbar Links (Desktop) */}
        <div className="hidden lg:flex space-x-6">
          <Link to="/login" className="text-white hover:text-gray-200 transition duration-200">
            Login
          </Link>
          <Link to="/signup" className="text-white hover:text-gray-200 transition duration-200">
            SignUp
          </Link>
          {loading && <span className="text-white">Loading...</span>}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-dark absolute top-16 left-0 w-full shadow-lg">
          <div className="flex flex-col space-y-4 p-4">
            <Link to="/login" className="text-white hover:text-gray-200 transition duration-200">
              Login
            </Link>
            <Link to="/signup" className="text-white hover:text-gray-200 transition duration-200">
              SignUp
            </Link>
            {loading && <span className="text-white">Loading...</span>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
