'use client'

import { useRef, useState } from 'react'
import { useRider } from '@/providers/RiderProvider'
import { Preview, PreviewHandle } from '@/components/Preview'
import { FooterNav } from '@/components/FooterNav'

export default function RiderPreviewPage() {
  const { data } = useRider()
  const previewRef = useRef<PreviewHandle>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (previewRef.current) {
      setIsDownloading(true)
      await previewRef.current.downloadPdf()
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-8 py-4 md:py-8">
        <Preview data={data} ref={previewRef} />
      </div>
      <FooterNav onDownload={handleDownload} isDownloading={isDownloading} />
    </div>
  )
}
