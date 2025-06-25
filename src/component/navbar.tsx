'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLogIn, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { FaUserPlus } from 'react-icons/fa';
import api from '@/utils/api'; // Ensure this path is correct
import { useAuth } from '@/contexts/AuthContext'; // Ensure this path is correct

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuTop, setMobileMenuTop] = useState(0);
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, setRole, loading } = useAuth(); // Destructure loading from useAuth

  const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });

      // Clear auth context
      setIsLoggedIn(false);
      setRole(null);

      // Clear sessionStorage fallback (optional but recommended)
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('role');

      // Redirect to home
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to log out. Please try again.');
    }
  };
  
  useEffect(() => {
    const updateMobileMenuTop = () => {
      if (headerRef.current) {
        setMobileMenuTop(headerRef.current.offsetHeight);
      }
    };
    updateMobileMenuTop(); // Set initially
    window.addEventListener('resize', updateMobileMenuTop);
    return () => window.removeEventListener('resize', updateMobileMenuTop);
  }, []);

  // Render authentication buttons based on login status
  const renderAuthButtons = () => {
    if (loading) {
      return null; // Don't render anything while auth status is being checked
    }
    return isLoggedIn ? (
      <button
        onClick={handleLogout}
        className="flex items-center bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition duration-200 ease-in-out"
      >
        <FiLogOut className="mr-2" /> Logout
      </button>
    ) : (
      <>
        <Link href="/login" className="flex items-center bg-amber-50 text-black px-4 py-2 border rounded hover:bg-gray-100 transition duration-200 ease-in-out">
          <FiLogIn className="mr-2" /> Log in
        </Link>
        <Link href="/signup" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 ease-in-out">
          <FaUserPlus className="mr-2" /> Sign up
        </Link>
      </>
    );
  };

  return (
    <header ref={headerRef} className="w-full bg-white shadow-md h-16 fixed z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo and Site Title */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-blue-600 text-2xl">💧</div> {/* Placeholder for a logo */}
          <span className="text-xl font-bold text-gray-900">PetroLearn</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/study" className="text-gray-700 hover:text-blue-600 transition duration-200 ease-in-out">Study</Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition duration-200 ease-in-out">About</Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition duration-200 ease-in-out">Contact</Link>
          {renderAuthButtons()}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button onClick={toggleMenu} className="lg:hidden text-gray-700 focus:outline-none" aria-label="Toggle Menu">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      <div
        className={`lg:hidden bg-white shadow-lg absolute left-0 right-0 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
        style={{
          top: `${mobileMenuTop}px`,
          visibility: isOpen ? 'visible' : 'hidden', // Hide when not open to prevent interaction
        }}
      >
        <div className="flex flex-col px-6 py-4 space-y-4">
          <Link href="/study" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition duration-200 ease-in-out">Study</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition duration-200 ease-in-out">About</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600 transition duration-200 ease-in-out">Contact</Link>
          {/* Mobile Auth Buttons */}
          {loading ? null : ( // Don't render until loading is complete
            isLoggedIn ? (
              <button
                onClick={() => {
                  setIsOpen(false); // Close menu on logout
                  handleLogout();
                }}
                className="flex items-center bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition duration-200 ease-in-out"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center bg-amber-50 text-black px-4 py-2 border rounded hover:bg-gray-100 transition duration-200 ease-in-out">
                  <FiLogIn className="mr-2" /> Log in
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 ease-in-out">
                  <FaUserPlus className="mr-2" /> Sign up
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}