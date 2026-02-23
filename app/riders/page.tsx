'use client'

import Link from 'next/link'
import { Footer } from '@/components/Footer'

export default function RidersOverviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">🎸</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Riders overview
            </h1>
            <p className="text-gray-600 mb-8">
              Your riders dashboard is coming soon. You'll be able to manage, edit, and share your riders here.
            </p>

            <Link href="/">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                Create a new rider
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
