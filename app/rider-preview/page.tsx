'use client'

import { useRef, useState } from 'react'
import { useRider } from '@/providers/RiderProvider'
import { Preview, PreviewHandle } from '@/components/Preview'
import { FooterNav } from '@/components/FooterNav'
import { DownloadModal } from '@/components/DownloadModal'

export default function RiderPreviewPage() {
  const { data } = useRider()
  const previewRef = useRef<PreviewHandle>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDownload = () => {
    // Open modal instead of downloading directly
    setIsModalOpen(true)
  }

  const handleModalConfirm = async (email: string) => {
    try {
      setIsDownloading(true)

      // Save rider to Supabase and send email (fire and forget)
      const savePromise = fetch('/api/riders/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          riderData: data,
        }),
      }).catch((err) => {
        console.error('Failed to save rider:', err)
        // Don't block the download if save fails
      })

      // Download PDF immediately
      if (previewRef.current) {
        await previewRef.current.downloadPdf()
      }

      // Wait for save to complete (but don't block download)
      await savePromise

      setIsModalOpen(false)
      setIsDownloading(false)
    } catch (error) {
      console.error('Error during download:', error)
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-8 py-4 md:py-8">
        <Preview data={data} ref={previewRef} />
      </div>
      <FooterNav onDownload={handleDownload} isDownloading={isDownloading} />

      <DownloadModal
        isOpen={isModalOpen}
        prefillEmail={data.details.email}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  )
}
