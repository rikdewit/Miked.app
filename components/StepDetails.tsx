import React from 'react';
import { RiderData } from '../types';

interface StepDetailsProps {
  data: RiderData;
  setData: React.Dispatch<React.SetStateAction<RiderData>>;
}

export const StepDetails: React.FC<StepDetailsProps> = ({ data, setData }) => {

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, details: { ...prev.details, logoUrl: reader.result as string } }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">3</span>
        Details & Contact
      </h2>
      
      <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700 space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Act / Band Name *</label>
          <input 
            type="text" 
            value={data.details.bandName}
            onChange={(e) => setData(prev => ({...prev, details: {...prev.details, bandName: e.target.value}}))}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="The Super Band"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contact Person *</label>
            <input
              type="text"
              value={data.details.contactName}
              onChange={(e) => setData(prev => ({...prev, details: {...prev.details, contactName: e.target.value}}))}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={data.details.email}
              onChange={(e) => setData(prev => ({...prev, details: {...prev.details, email: e.target.value}}))}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Telefoon</label>
            <input
              type="tel"
              value={data.details.phone || ''}
              onChange={(e) => setData(prev => ({...prev, details: {...prev.details, phone: e.target.value}}))}
              placeholder="e.g. +31 6 12345678"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Website / Socials</label>
            <input
              type="text"
              value={data.details.website || ''}
              onChange={(e) => setData(prev => ({...prev, details: {...prev.details, website: e.target.value}}))}
              placeholder="e.g. https://example.com or Instagram @bandname"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Show Duration</label>
            <input
              type="text"
              value={data.details.showDuration || ''}
              onChange={(e) => setData(prev => ({...prev, details: {...prev.details, showDuration: e.target.value}}))}
              placeholder="e.g. 60 min"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Soundcheck Time</label>
            <input
              type="text"
              value={data.details.soundcheckDuration || ''}
              onChange={(e) => setData(prev => ({...prev, details: {...prev.details, soundcheckDuration: e.target.value}}))}
              placeholder="e.g. 45 min"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Stage Dimensions</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={data.details.stageWidth ?? ''}
              onChange={(e) => setData(prev => ({ ...prev, details: { ...prev.details, stageWidth: e.target.value ? Number(e.target.value) : undefined } }))}
              placeholder="Width"
              className="w-28 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="text-slate-400 font-bold">×</span>
            <input
              type="number"
              min={0}
              value={data.details.stageDepth ?? ''}
              onChange={(e) => setData(prev => ({ ...prev, details: { ...prev.details, stageDepth: e.target.value ? Number(e.target.value) : undefined } }))}
              placeholder="Depth"
              className="w-28 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex rounded-lg overflow-hidden border border-slate-600">
              {(['m', 'ft'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setData(prev => ({ ...prev, details: { ...prev.details, stageDimensionUnit: unit } }))}
                  className={`px-4 py-3 text-sm font-semibold transition-colors ${data.details.stageDimensionUnit === unit ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-300 mb-2">General Notes</label>
           <textarea 
             rows={4}
             value={data.details.generalNotes}
             onChange={(e) => setData(prev => ({...prev, details: {...prev.details, generalNotes: e.target.value}}))}
             placeholder="e.g. We bring our own van, need 3x2m space for banners..."
             className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
           />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Upload Logo (Optional)</label>
          <div className="flex items-center gap-4">
             <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer" />
             {data.details.logoUrl && (
               <img src={data.details.logoUrl} alt="Logo preview" className="h-10 w-10 object-contain bg-white rounded" />
             )}
          </div>
        </div>

      </div>
    </div>
  );
};