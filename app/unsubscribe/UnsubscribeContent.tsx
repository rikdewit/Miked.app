'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Footer } from '@/components/Footer'

export function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isAlreadyUnsubscribed, setIsAlreadyUnsubscribed] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      const decodedEmail = decodeURIComponent(emailParam)
      setEmail(decodedEmail)
      checkSubscriptionStatus(decodedEmail)
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  const checkSubscriptionStatus = async (emailToCheck: string) => {
    try {
      const response = await fetch(`/api/subscription-status?email=${encodeURIComponent(emailToCheck)}`)
      const data = await response.json()

      if (response.ok && !data.subscribed) {
        setIsAlreadyUnsubscribed(true)
      }
    } catch (err) {
      console.error('Error checking subscription status:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setIsSuccess(true)
    } catch (err) {
      console.error('Unsubscribe error:', err)
      setError('Failed to unsubscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 relative min-h-screen">
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-64 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 relative z-10 py-16">
        <PageHeader
          title="Unsubscribe"
          description="We'll remove you from the changelog email list"
          showBadge={false}
          titleColor="indigo"
        />

        <div className="mt-12 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-lg">
          {isLoading ? (
            <div className="text-center space-y-4">
              <div className="animate-spin inline-block">
                <div className="h-8 w-8 border-4 border-indigo-500 border-t-indigo-200 rounded-full"></div>
              </div>
              <p className="text-slate-300">Loading...</p>
            </div>
          ) : !email ? (
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-lg font-semibold text-slate-100">
                Invalid unsubscribe link
              </p>
              <p className="text-sm text-slate-400">
                The unsubscribe link appears to be incomplete. Please check your email or{' '}
                <Link href="/changelog" className="text-indigo-400 hover:text-indigo-300">
                  go back to the changelog
                </Link>
              </p>
            </div>
          ) : isAlreadyUnsubscribed ? (
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
              <p className="text-lg font-semibold text-slate-100">
                Already unsubscribed
              </p>
              <p className="text-sm text-slate-400">
                This email is not currently subscribed to the Miked.live changelog.
              </p>
              <div className="border-t border-slate-800 pt-6">
                <div className="flex gap-3">
                  <Link
                    href="/"
                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-center font-medium transition-colors"
                  >
                    Return home
                  </Link>
                  <Link
                    href="/changelog"
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-200 hover:bg-slate-700 text-center font-medium transition-colors"
                  >
                    View changelog
                  </Link>
                </div>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="bg-green-500/20 rounded-full p-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-slate-100">
                  Successfully unsubscribed
                </p>
                <p className="text-sm text-slate-400">
                  You've been removed from our changelog email list. You won't receive any more update emails.
                </p>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <p className="text-xs text-slate-500 text-center mb-4">
                  Note: You'll still receive important transactional emails, like magic links for rider access.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/"
                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-center font-medium transition-colors"
                  >
                    Return home
                  </Link>
                  <Link
                    href="/changelog"
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-200 hover:bg-slate-700 text-center font-medium transition-colors"
                  >
                    View changelog
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-slate-300">
                You're about to unsubscribe from the Miked.live changelog. This only removes you from our email list—you'll still receive important transactional emails if you have a rider saved.
              </p>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 disabled:opacity-75 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500">This email address is verified from your unsubscribe link.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Unsubscribing...
                  </>
                ) : (
                  'Confirm unsubscribe'
                )}
              </button>

              <div className="border-t border-slate-800 pt-6">
                <p className="text-xs text-slate-500 text-center">
                  Having second thoughts?{' '}
                  <Link href="/changelog" className="text-indigo-400 hover:text-indigo-300">
                    Go back to changelog
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
