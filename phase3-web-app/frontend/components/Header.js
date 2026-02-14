// components/Header.js
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Course Companion FTE
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-200 transition">Home</Link>
          <Link href="/courses" className="hover:text-blue-200 transition">Courses</Link>
          <Link href="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
          <Link href="/quiz" className="hover:text-blue-200 transition">Quizzes</Link>
          <Link href="/progress" className="hover:text-blue-200 transition">Progress</Link>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 py-4">
          <nav className="flex flex-col px-4 space-y-3">
            <Link href="/" className="hover:text-blue-200 transition">Home</Link>
            <Link href="/courses" className="hover:text-blue-200 transition">Courses</Link>
            <Link href="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link href="/quiz" className="hover:text-blue-200 transition">Quizzes</Link>
            <Link href="/progress" className="hover:text-blue-200 transition">Progress</Link>
          </nav>
        </div>
      )}
    </header>
  );
}