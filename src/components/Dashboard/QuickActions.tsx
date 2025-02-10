'use client';

import { useUser } from '@clerk/nextjs';

export default function QuickActions() {
  const { user } = useUser();
  const currentRole = user?.publicMetadata?.role as string || 'CANDIDATE';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        {currentRole === 'EMPLOYER' ? (
          <>
            <a
              href="/jobs/post"
              className="block w-full p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <h3 className="font-medium">Post a New Job</h3>
              <p className="text-sm text-gray-500">
                Create a new job listing to find candidates
              </p>
            </a>
            <a
              href="/jobs/manage"
              className="block w-full p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <h3 className="font-medium">Manage Jobs</h3>
              <p className="text-sm text-gray-500">
                View and manage your job listings
              </p>
            </a>
          </>
        ) : (
          <>
            <a
              href="/jobs"
              className="block w-full p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <h3 className="font-medium">Browse Jobs</h3>
              <p className="text-sm text-gray-500">
                Search and apply for jobs
              </p>
            </a>
            <a
              href="/profile"
              className="block w-full p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <h3 className="font-medium">Update Profile</h3>
              <p className="text-sm text-gray-500">
                Keep your profile and skills up to date
              </p>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
