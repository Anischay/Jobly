'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const isEmployer = user?.publicMetadata?.role === 'EMPLOYER';

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-[#111827]/95 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Jobly.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/industries" className="text-gray-300 hover:text-white transition-colors">
                Industries
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              {isSignedIn && (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  {isEmployer && (
                    <Link 
                      href="/jobs/post" 
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Post a Job
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  {user.firstName || user.username}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#111827] border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/features"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/industries"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Industries
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {isSignedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {isEmployer && (
                  <Link
                    href="/jobs/post"
                    className="block px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Post a Job
                  </Link>
                )}
              </>
            )}
            {!isSignedIn ? (
              <div className="space-y-2 px-3 pt-2">
                <SignInButton mode="modal">
                  <button className="w-full text-left text-gray-300 hover:text-white transition-colors py-2">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            ) : (
              <div className="px-3 pt-2 flex items-center space-x-4">
                <span className="text-gray-300">
                  {user.firstName || user.username}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
