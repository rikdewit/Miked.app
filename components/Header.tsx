'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Mic } from 'lucide-react'

export const Header: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()

  const routes = ['/', '/band', '/stage', '/details', '/rider-preview']
  const stepIndex = routes.indexOf(pathname)

  const handleLogoClick = () => {
    router.push('/')
  }

  // Only show breadcrumb on non-landing pages (stepIndex >= 1)
  if (stepIndex <= 0) {
    return (
      <nav className="no-print bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-[1000]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <Mic className="text-indigo-500" />
            <span>miked<span className="text-indigo-500">.live</span></span>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="no-print bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-[1000]">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="font-bold text-xl flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <Mic className="text-indigo-500" />
          <span>miked<span className="text-indigo-500">.live</span></span>
        </div>
        <div className="flex-1 flex items-center justify-end gap-6 text-sm text-slate-400">
          {/* Full text version - shown only on larger screens */}
          <span className="hidden md:inline">
            <span className={stepIndex >= 1 ? 'text-indigo-400 font-bold' : ''}>1. Band</span>
            <span className="mx-3">→</span>
            <span className={stepIndex >= 2 ? 'text-indigo-400 font-bold' : ''}>2. Stage</span>
            <span className="mx-3">→</span>
            <span className={stepIndex >= 3 ? 'text-indigo-400 font-bold' : ''}>3. Details</span>
            <span className="mx-3">→</span>
            <span className={stepIndex >= 4 ? 'text-indigo-400 font-bold' : ''}>4. Download</span>
          </span>

          {/* Number-only version - shown on smaller screens */}
          <span className="md:hidden">
            <span className={stepIndex >= 1 ? 'text-indigo-400 font-bold' : ''}>1</span>
            <span className="mx-4">→</span>
            <span className={stepIndex >= 2 ? 'text-indigo-400 font-bold' : ''}>2</span>
            <span className="mx-4">→</span>
            <span className={stepIndex >= 3 ? 'text-indigo-400 font-bold' : ''}>3</span>
            <span className="mx-4">→</span>
            <span className={stepIndex >= 4 ? 'text-indigo-400 font-bold' : ''}>4</span>
          </span>
        </div>
      </div>
    </nav>
  )
}