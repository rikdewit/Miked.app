import React, { useState, useRef } from 'react';
import { useRiderState } from './hooks/useRiderState';
import { Header } from './components/Header';
import { FooterNav } from './components/FooterNav';
import { Landing } from './components/Landing';
import { StepInstruments } from './components/StepInstruments';
import { StepStagePlot } from './components/StepStagePlot';
import { StepDetails } from './components/StepDetails';
import { Preview, PreviewHandle } from './components/Preview';

const App: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Landing, 1: Instruments, 2: Stage, 3: Details, 4: Preview
  const previewRef = useRef<PreviewHandle>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { 
    data, 
    setData, 
    addMember, 
    applyRockTemplate, 
    updateMemberName, 
    updateMemberNotes, 
    addMemberInstrument, 
    updateMemberInstrument, 
    removeMemberInstrument, 
    removeMember, 
    updateStageItems 
  } = useRiderState();

  // --- Navigation & Validation ---
  const canProceed = () => {
    if (step === 1) {
        return data.members.length > 0 && 
               data.members.every(m => m.name.trim() !== '' && m.instrumentIds.length > 0);
    }
    if (step === 3) return data.details.bandName.trim() !== '' && data.details.contactName.trim() !== '';
    return true;
  };

  const handleDownload = async () => {
    if (previewRef.current) {
      setIsDownloading(true);
      await previewRef.current.downloadPdf();
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col">
      <Header step={step} setStep={setStep} />

      <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
        {step === 0 && <Landing onStart={() => setStep(1)} />}
        
        {step === 1 && (
          <StepInstruments 
            data={data}
            addMember={addMember}
            applyRockTemplate={applyRockTemplate}
            updateMemberName={updateMemberName}
            updateMemberNotes={updateMemberNotes}
            updateMemberInstrument={updateMemberInstrument}
            removeMemberInstrument={removeMemberInstrument}
            addMemberInstrument={addMemberInstrument}
            removeMember={removeMember}
          />
        )}

        {step === 2 && (
          <StepStagePlot 
            data={data}
            setData={setData}
            updateStageItems={updateStageItems}
          />
        )}

        {step === 3 && (
          <StepDetails 
            data={data}
            setData={setData}
          />
        )}

        {step === 4 && (
          <Preview data={data} ref={previewRef} />
        )}
      </main>

      <FooterNav 
        step={step} 
        setStep={setStep} 
        canProceed={canProceed()} 
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
    </div>
  );
};

export default App;