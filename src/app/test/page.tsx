'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [apiStatus, setApiStatus] = useState<string>('Loading...');

  useEffect(() => {
    fetch('http://localhost:8000')
      .then(res => res.json())
      .then(data => setApiStatus(JSON.stringify(data, null, 2)))
      .catch(err => setApiStatus('Error connecting to API: ' + err.message));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Frontend Status</h2>
        <p className="text-green-600">✓ Next.js is running!</p>
        
        <h2 className="text-xl font-semibold mb-4 mt-8">Backend Status</h2>
        <pre className="bg-gray-50 p-4 rounded">
          {apiStatus}
        </pre>
      </div>
    </div>
  );
}
