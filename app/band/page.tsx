'use client'

import dynamic from 'next/dynamic'
import { useRider } from '@/providers/RiderProvider'
import { FooterNav } from '@/components/FooterNav'

const StepInstruments = dynamic(() => import('@/components/StepInstruments').then(m => ({ default: m.StepInstruments })), { ssr: false })

export default function BandPage() {
  const {
    data,
    addMember,
    applyRockTemplate,
    updateMemberName,
    addMemberInstrument,
    updateMemberInstrument,
    removeMemberInstrument,
    removeMember,
    updateInstrumentInputs
  } = useRider()

  const canProceed =
    data.members.length > 0 &&
    data.members.every(m => m.name.trim() !== '' && m.instruments.length > 0)

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center p-4 md:p-8">
      <StepInstruments
        data={data}
        addMember={addMember}
        applyRockTemplate={applyRockTemplate}
        updateMemberName={updateMemberName}
        updateMemberInstrument={updateMemberInstrument}
        removeMemberInstrument={removeMemberInstrument}
        addMemberInstrument={addMemberInstrument}
        removeMember={removeMember}
        updateInstrumentInputs={updateInstrumentInputs}
      />
      <FooterNav canProceed={canProceed} />
    </div>
  )
}
