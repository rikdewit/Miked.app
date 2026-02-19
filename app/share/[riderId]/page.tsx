'use client'

import { useEffect, use, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Preview, PreviewHandle } from '@/components/Preview'
import { RiderData } from '@/types'
import { Download, Loader2 } from 'lucide-react'

interface SharePageProps {
  params: Promise<{
    riderId: string
  }>
}

export default function SharePage({ params }: SharePageProps) {
  const { riderId } = use(params)
  const router = useRouter()
  const previewRef = useRef<PreviewHandle>(null)
  const [riderData, setRiderData] = useState<RiderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const fetchRider = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/share/${riderId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('not_found')
          } else {
            setError('unknown')
          }
          return
        }

        const data = await response.json()
        setRiderData(data.riderData)
      } catch (err) {
        console.error('Failed to fetch rider:', err)
        setError('unknown')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRider()
  }, [riderId])

  const handleDownload = async () => {
    if (!previewRef.current) return

    try {
      setIsDownloading(true)
      await previewRef.current.generatePdf()
      previewRef.current.savePdf()
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  // Error state: Rider not found
  if (!isLoading && error === 'not_found') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Rider not found
            </h1>
            <p className="text-gray-600 mb-8">
              This rider doesn't exist or has been removed.
            </p>
            <Link href="/">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                Create a new rider
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Error state: Unknown error
  if (!isLoading && error === 'unknown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              We couldn't load the rider. Please try again later.
            </p>
            <Link href="/">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                Create a new rider
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading rider...</p>
        </div>
      </div>
    )
  }

  // Loaded state
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {riderData ? (
        <>
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-8 py-4 md:py-8">
            <Preview data={riderData} ref={previewRef} />
          </div>

          {/* Floating action bar */}
          <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-center">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-wait text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your rider...</p>
          </div>
        </div>
      )}
    </div>
  )
}
