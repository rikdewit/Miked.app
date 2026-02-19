'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Download, Loader2 } from 'lucide-react'

interface FooterNavProps {
  canProceed?: boolean
  onDownload?: () => void
  isDownloading?: boolean
  onAttemptProceed?: () => void
}

export const FooterNav: React.FC<FooterNavProps> = ({ canProceed = true, onDownload, isDownloading, onAttemptProceed }) => {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/') return null

  const routes = ['/band', '/stage', '/details', '/rider-preview']
  const currentIndex = routes.indexOf(pathname)

  const handleBack = () => {
    if (currentIndex === 0) {
      router.push('/')
    } else {
      router.push(routes[currentIndex - 1])
    }
  }

  const handleNext = () => {
    onAttemptProceed?.()
    if (canProceed && currentIndex < routes.length - 1) {
      router.push(routes[currentIndex + 1])
    }
  }

  const isLastStep = currentIndex === routes.length - 1

  return (
    <div className="no-print bg-slate-950 p-4 border-t border-slate-800 sticky bottom-0 w-full z-[1000]">
      <div className="max-w-4xl mx-auto flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {!isLastStep ? (
          <button
            onClick={handleNext}
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
              canProceed
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Next Step <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-wait text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
        )}
      </div>
    </div>
  )
}