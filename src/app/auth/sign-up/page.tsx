'use client'

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-purple-500 hover:bg-purple-600',
              footerActionLink: 'text-purple-400 hover:text-purple-300',
            }
          }}
        />
      </div>
    </div>
  )
} 