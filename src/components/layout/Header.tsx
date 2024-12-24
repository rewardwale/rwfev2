"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "../../hooks/use-router";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn,setisloggedIn]=useState(false)

  const router = useRouter();
  
  const checkToken = async () => {
    const token = localStorage.getItem("token");
  
    if (token)
   token.length>0
        ? setisloggedIn(true)
        : setisloggedIn(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkToken();
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, []);


  return (
    <div>
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white border-b-2 border-slate-200">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <div onClick={() => router.push("/")}>
            <Image
              style={{ marginBottom: "7px" }}
              src={
                "https://rewardwale.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FRW_Black_Logo.86498c6e.png&w=256&q=75"
              }
              className="cursor-pointer"
              width={90}
              height={2}
              alt="Brand logo"
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 ml-10">
            <a  className="text-gray-600 hover:text-gray-900 cursor-pointer"
            onClick={() => router.push('/about-us')}
            >
              About
            </a>
            <a
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={() => router.push("/contact-us")}
            >
              Contact
            </a>
            <a
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={() => router.push("/how-it-works")}
            >
              How it Works
            </a>
          </div>
        </div>

        {/* Right Section: Search and Login */}
        <div className="flex items-center space-x-4">
          {/* Search Box (Desktop only) */}
          {/* <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md p-2 focus:outline-none"
            />
          </div> */}

          {/* Search Icon (Mobile only) */}
          <div className="md:hidden">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns=""
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 17a6 6 0 100-12 6 6 0 000 12zm0 0l4 4"
                ></path>
              </svg>
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={() => {loggedIn ?router.push("/home"):router.push("/login")} }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
          {loggedIn ? "Home" : "Login"}  
          </button>

          {/* Hamburger Menu (Mobile only) */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white p-4 shadow-md md:hidden">
            <a
              
              className="block text-gray-600 hover:text-gray-900 mb-2"
            >
              About Us
            </a>
            <a
              href="#contact"
              className="block text-gray-600 hover:text-gray-900 mb-2"
            >
              Contact
            </a>
            <a
              href="#how-it-works"
              className="block text-gray-600 hover:text-gray-900"
            >
              How it Works
            </a>
          </div>
        )}
      </nav>

      {/* Mobile Search Box (appears below navbar on click) */}
      {isSearchOpen && (
        <div className="p-4 bg-white shadow-md md:hidden">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border rounded-md p-2 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
