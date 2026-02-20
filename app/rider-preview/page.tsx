'use client'

import { useRef, useState, useEffect } from 'react'
import { useRider } from '@/providers/RiderProvider'
import { Preview, PreviewHandle } from '@/components/Preview'
import { FooterNav } from '@/components/FooterNav'
import { DownloadModal } from '@/components/DownloadModal'

export default function RiderPreviewPage() {
  const { data } = useRider()
  const previewRef = useRef<PreviewHandle>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [hasPdfGenerated, setHasPdfGenerated] = useState(false)
  const [lastSentEmail, setLastSentEmail] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Mark as mounted to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Reset PDF generation when rider data changes
  useEffect(() => {
    setHasPdfGenerated(false)
  }, [data])

  const handleDownload = () => {
    // Only generate PDF if we don't already have one
    if (!hasPdfGenerated && previewRef.current) {
      previewRef.current.generatePdf().catch((err) => {
        console.error('PDF generation error:', err)
      })
      setHasPdfGenerated(true)
    }
    // Open modal
    setIsModalOpen(true)
  }

  const handleModalConfirm = async (email: string) => {
    try {
      // Save the generated PDF (with email context for analytics)
      if (previewRef.current) {
        previewRef.current.savePdf(email)
      }

      // Save rider to Supabase and send email
      await fetch('/api/riders/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          riderData: data,
        }),
      }).then((res) => {
        if (res.ok) {
          setLastSentEmail(email)
        }
      }).catch((err) => {
        console.error('Failed to save rider:', err)
      })

      // Don't close the modal here - let DownloadModal show success screen
    } catch (error) {
      console.error('Error during confirm:', error)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {isMounted && data.details.bandName ? (
        <>
          <div className="flex-1 overflow-y-auto">
            <Preview data={data} ref={previewRef} onDownloadClick={handleDownload} onGeneratingChange={setIsGeneratingPdf} />
          </div>
          <FooterNav onDownload={handleDownload} isDownloading={isGeneratingPdf} />

          <DownloadModal
            isOpen={isModalOpen}
            prefillEmail={data.details.email}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleModalConfirm}
            isGeneratingPdf={isGeneratingPdf}
            lastSentEmail={lastSentEmail}
          />
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
