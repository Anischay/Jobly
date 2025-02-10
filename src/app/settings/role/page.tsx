'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function RoleSettingsPage() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const currentRole = user?.publicMetadata?.role as string || 'CANDIDATE';

  const setRole = async (role: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Reload the page to refresh Clerk user data
      window.location.reload();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in or create an account to access account settings.
          </p>
          <div className="space-x-4">
            <SignInButton mode="modal">
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Account Type</h2>
        <p className="text-gray-600 mb-4">
          Choose your account type. This will determine what features you have access to.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => setRole('CANDIDATE')}
            disabled={isLoading || currentRole === 'CANDIDATE'}
            className={`w-full p-4 rounded-lg border ${
              currentRole === 'CANDIDATE'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
            } transition-colors`}
          >
            <div className="flex items-center">
              <div className="flex-1 text-left">
                <h3 className="font-medium">Job Seeker</h3>
                <p className="text-sm text-gray-500">
                  Search for jobs and apply to positions
                </p>
              </div>
              {currentRole === 'CANDIDATE' && (
                <span className="text-purple-600">Current</span>
              )}
            </div>
          </button>

          <button
            onClick={() => setRole('EMPLOYER')}
            disabled={isLoading || currentRole === 'EMPLOYER'}
            className={`w-full p-4 rounded-lg border ${
              currentRole === 'EMPLOYER'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
            } transition-colors`}
          >
            <div className="flex items-center">
              <div className="flex-1 text-left">
                <h3 className="font-medium">Employer</h3>
                <p className="text-sm text-gray-500">
                  Post jobs and manage applications
                </p>
              </div>
              {currentRole === 'EMPLOYER' && (
                <span className="text-purple-600">Current</span>
              )}
            </div>
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500 mt-4">
            Updating your account type...
          </p>
        )}
      </div>
    </div>
  );
}
