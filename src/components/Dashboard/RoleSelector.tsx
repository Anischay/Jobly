'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function RoleSelector() {
  const { user } = useUser();
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Account Type</h2>
      <p className="text-gray-600 mb-4">
        Choose your account type to access different features.
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
  );
}
