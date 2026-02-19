'use client'

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePostHog } from 'posthog-js/react';
import { useRiderState } from '@/hooks/useRiderState';
import { Header } from '@/components/Header';
import { FooterNav } from '@/components/FooterNav';
import { Landing } from '@/components/Landing';
import { StepDetails } from '@/components/StepDetails';
import { Preview, PreviewHandle } from '@/components/Preview';

// Three.js Canvas components need ssr:false
const StepInstruments = dynamic(() => import('@/components/StepInstruments').then(m => ({ default: m.StepInstruments })), { ssr: false })
const StepStagePlot = dynamic(() => import('@/components/StepStagePlot').then(m => ({ default: m.StepStagePlot })), { ssr: false })

const App: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Landing, 1: Instruments, 2: Stage, 3: Details, 4: Preview
  const previewRef = useRef<PreviewHandle>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDetailsErrors, setShowDetailsErrors] = useState(false);

  const {
    data,
    setData,
    addMember,
    applyRockTemplate,
    updateMemberName,
    addMemberInstrument,
    updateMemberInstrument,
    removeMemberInstrument,
    removeMember,
    updateStageItems,
    updateInstrumentInputs
  } = useRiderState();

  const posthog = usePostHog();

  const stepNames = ['landing', 'instruments', 'stage_plot', 'details', 'preview'];

  // Track step view
  useEffect(() => {
    posthog?.capture('step_viewed', {
      step,
      step_name: stepNames[step],
    });
  }, [step, posthog]);

  // --- Navigation & Validation ---
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const canProceed = () => {
    if (step === 1) {
        return data.members.length > 0 &&
               data.members.every(m => m.name.trim() !== '' && m.instruments.length > 0);
    }
    if (step === 3) {
        return data.details.bandName.trim() !== '' &&
               data.details.contactName.trim() !== '' &&
               isValidEmail(data.details.email);
    }
    return true;
  };

  const handleDownload = async () => {
    if (previewRef.current) {
      setIsDownloading(true);
      await previewRef.current.downloadPdf();
      setIsDownloading(false);
    }
  };

  const handleAttemptProceed = () => {
    if (step === 3) {
      setShowDetailsErrors(true);
    }
  };

  const handleSetStep = (newStep: number | ((prevStep: number) => number)) => {
    setShowDetailsErrors(false);
    setStep(newStep);
  };

  return (
    <div className="h-dvh overflow-hidden bg-slate-900 text-slate-100 flex flex-col">
      <Header step={step} setStep={handleSetStep} />

      <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* Padding and centering for non-stage steps */}
        {step !== 2 && (
          <div className={`flex-1 overflow-y-auto flex flex-col items-center ${step === 4 ? 'px-2 sm:px-4 md:px-8 py-4 md:py-8' : 'p-4 md:p-8'}`}>
            {step === 0 && <Landing onStart={() => {
              posthog?.capture('start_now_clicked');
              setStep(1);
            }} />}

            {step === 1 && (
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
            )}

            {step === 3 && (
              <StepDetails
                data={data}
                setData={setData}
                showErrors={showDetailsErrors}
              />
            )}

            {step === 4 && (
              <Preview data={data} ref={previewRef} />
            )}
          </div>
        )}

        {/* Full height for stage plot */}
        {step === 2 && (
          <div className="flex-1 min-h-0 p-4 md:p-8 overflow-hidden">
            <StepStagePlot
              data={data}
              setData={setData}
              updateStageItems={updateStageItems}
            />
          </div>
        )}
      </main>

      <FooterNav
        step={step}
        setStep={handleSetStep}
        canProceed={canProceed()}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        onAttemptProceed={handleAttemptProceed}
      />
    </div>
  );
};

export default App;
