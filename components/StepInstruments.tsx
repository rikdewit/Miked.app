import React from 'react';
import { Plus, Trash2, Info, Music2, X } from 'lucide-react';
import { RiderData } from '../types';
import { INSTRUMENTS } from '../constants';
import { MemberPreview3D } from './MemberPreview3D';

interface StepInstrumentsProps {
  data: RiderData;
  addMember: () => void;
  applyRockTemplate: () => void;
  updateMemberName: (id: string, name: string) => void;
  updateMemberNotes: (id: string, notes: string) => void;
  updateMemberInstrument: (memberId: string, index: number, instrumentId: string) => void;
  removeMemberInstrument: (memberId: string, index: number) => void;
  addMemberInstrument: (memberId: string) => void;
  removeMember: (id: string) => void;
}

export const StepInstruments: React.FC<StepInstrumentsProps> = ({
  data,
  addMember,
  applyRockTemplate,
  updateMemberName,
  updateMemberNotes,
  updateMemberInstrument,
  removeMemberInstrument,
  addMemberInstrument,
  removeMember
}) => {
  // Get unique groups for the dropdown
  const uniqueGroups = Array.from(new Set(INSTRUMENTS.map(i => i.group)));

  // Helper to find valid default ID when switching groups
  const getDefaultIdForGroup = (groupName: string) => {
    return INSTRUMENTS.find(i => i.group === groupName)?.id || INSTRUMENTS[0].id;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <span className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">1</span>
        Instruments & Members
      </h2>
      
      {data.members.length === 0 && (
        <div className="mb-6 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Start Templates</h3>
          <button 
            onClick={applyRockTemplate}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-900 to-slate-800 border border-indigo-500/30 hover:border-indigo-500 p-4 rounded-xl text-left transition-all hover:shadow-lg hover:shadow-indigo-500/20 group"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                 <Music2 size={20} />
              </div>
              <span className="font-bold text-white text-lg">Rock Band</span>
            </div>
            <p className="text-slate-400 text-sm pl-[52px]">
              Drums, Bass, Electric Guitar, Lead Vocals
            </p>
          </button>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
        <div className="space-y-6">
          {data.members.map((member, index) => (
            <div key={member.id} className="relative bg-slate-700/50 rounded-lg p-1 animate-fadeIn border border-slate-600/50">
              <span className="absolute top-2 left-2 z-10 text-xs font-mono font-bold text-white bg-slate-600 px-2 py-0.5 rounded">#{index + 1}</span>
              
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
                  {/* LEFT COLUMN: 3D PREVIEW */}
                  <div className="h-[250px] md:h-auto min-h-[250px] w-full p-2">
                     <MemberPreview3D member={member} />
                  </div>

                  {/* RIGHT COLUMN: FORM INPUTS */}
                  <div className="p-4 pt-0 md:pt-4 md:pl-0 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 block mb-1">Member Name</label>
                            <input 
                            type="text" 
                            value={member.name}
                            onChange={(e) => updateMemberName(member.id, e.target.value)}
                            placeholder="e.g. John"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 block mb-1">Notes (optional)</label>
                            <input 
                            type="text" 
                            value={member.notes}
                            onChange={(e) => updateMemberNotes(member.id, e.target.value)}
                            placeholder="e.g. Own vocal mic"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600/50">
                        <label className="text-xs text-slate-400 block mb-3 font-bold uppercase tracking-wide">Instruments & Gear</label>
                        <div className="space-y-3">
                            {member.instrumentIds.map((instId, iIndex) => {
                                const currentInstrument = INSTRUMENTS.find(i => i.id === instId);
                                const variants = INSTRUMENTS.filter(i => i.group === currentInstrument?.group);

                                return (
                                <div key={iIndex} className="flex flex-col gap-2 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                    <div className="flex gap-2 items-center">
                                        <select 
                                            value={currentInstrument?.group || uniqueGroups[0]}
                                            onChange={(e) => updateMemberInstrument(member.id, iIndex, getDefaultIdForGroup(e.target.value))}
                                            className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                                        >
                                        {uniqueGroups.map(group => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                        </select>
                                        <button 
                                            onClick={() => removeMemberInstrument(member.id, iIndex)}
                                            disabled={member.instrumentIds.length === 1}
                                            className={`p-2 rounded transition-colors ${member.instrumentIds.length === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400 hover:bg-slate-900'}`}
                                            title="Remove instrument"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    
                                    {/* Variants Selection (if multiple options exist) */}
                                    {variants.length > 1 && (
                                        <div className="flex flex-wrap gap-2">
                                            {variants.map(variant => (
                                                <button
                                                    key={variant.id}
                                                    onClick={() => updateMemberInstrument(member.id, iIndex, variant.id)}
                                                    className={`text-[10px] sm:text-xs px-2 py-1.5 rounded-md border font-medium transition-all ${
                                                        instId === variant.id 
                                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' 
                                                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'
                                                    }`}
                                                >
                                                    {variant.variantLabel || variant.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )})}
                            <button 
                                onClick={() => addMemberInstrument(member.id)}
                                className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 mt-3 font-medium px-1"
                            >
                                <Plus size={14} /> Add another instrument
                            </button>
                        </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeMember(member.id)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded p-2 transition-colors z-10"
                    title="Remove member"
                  >
                    <Trash2 size={18} />
                  </button>
              </div>
            </div>
          ))}

          <button 
            onClick={addMember}
            className="w-full py-6 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 font-bold text-lg group"
          >
            <div className="bg-slate-700 group-hover:bg-indigo-900 p-2 rounded-full transition-colors">
                 <Plus className="group-hover:text-white" /> 
            </div>
            Add Band Member
          </button>
        </div>
        
        {data.members.length === 0 && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/50 text-blue-200 rounded-lg text-sm flex gap-3 items-center">
            <Info className="shrink-0" />
            <p>Start by adding your band members. You can assign multiple instruments per person.</p>
          </div>
        )}
      </div>
    </div>
  );
};