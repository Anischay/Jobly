'use client'

import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm">
        <SignIn 
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
