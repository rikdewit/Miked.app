'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'

interface RiderAccessPageProps {
  params: {
    token: string
  }
}

export default function RiderAccessPage({ params }: RiderAccessPageProps) {
  const posthog = usePostHog()

  // Track when user accesses rider via email link
  useEffect(() => {
    posthog?.capture('rider_link_accessed', {
      token: params.token,
    })
  }, [params.token, posthog])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-4xl mb-4">🎸</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your rider is saved!
          </h1>
          <p className="text-gray-600 mb-8">
            You can access and manage your rider anytime using this link.
          </p>

          {/* Dashboard coming soon section */}
          <div className="bg-indigo-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-700 mb-4">
              <strong>Dashboard coming soon:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>View all your saved riders</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Edit and update your rider</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Share with venues and teams</span>
              </li>
            </ul>
          </div>

          {/* Token display for debugging */}
          <div className="bg-gray-100 rounded p-3 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-1">Magic link token:</p>
            <code className="text-xs text-gray-700 break-all font-mono">
              {params.token}
            </code>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                Create another rider
              </button>
            </Link>
            <p className="text-xs text-gray-500">
              Keep this link safe — you can use it anytime to access your rider.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
