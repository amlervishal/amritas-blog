'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';

const Navigation = ({ user }) => {
  const router = useRouter();
  const auth = getAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
      setIsMenuOpen(false); // Close menu after sign out
    } catch (error) {
      // console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <nav className="max-w-6xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 px-6 py-3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:4px_4px]">
        <div className="flex items-center justify-between">
          {/* Left - Pin Icon */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 17v5"/>
                <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
              </svg>
            </Link>
          </div>

          {/* Center - Title and Subtitle */}
          <div className="flex flex-col items-center">
            <Link href="/" className="font-Logo text-lg md:text-xl font-medium text-gray-800 hover:text-rose-600 transition-colors">
              Pin drop silence
            </Link>
            <p className="font-Primary text-xs text-gray-600 tracking-wide font-light">
              Blogs by Dr. Amrita Vohra
            </p>
          </div>

          {/* Right - Hamburger Menu */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col space-y-1">
                <span className={`block w-5 h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-600 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition-colors font-Primary"
                >
                  About
                </Link>

                {user ? (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100 font-Primary">
                      Welcome, {user.displayName || user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-Primary"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition-colors font-Primary"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;