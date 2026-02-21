'use client'

import dynamic from 'next/dynamic'
import { useRider } from '@/providers/RiderProvider'
import { FooterNav } from '@/components/FooterNav'

const StepStagePlot = dynamic(() => import('@/components/StepStagePlot').then(m => ({ default: m.StepStagePlot })), { ssr: false })

export default function StagePage() {
  const { data, setData, updateStageItems } = useRider()

  return (
    <>
      <div className="flex-1 min-h-0 p-4 md:p-8 overflow-auto">
        <StepStagePlot
          data={data}
          setData={setData}
          updateStageItems={updateStageItems}
        />
      </div>
      <FooterNav canProceed={true} />
    </>
  )
}
