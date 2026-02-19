'use client'

import React from 'react';
import { BandMember } from '../types';
import { INSTRUMENTS } from '../constants';
import { getDefaultInputsForSlot } from '../utils/inputUtils';

interface InputListProps {
  members: BandMember[];
}

export const InputList: React.FC<InputListProps> = ({ members }) => {
  // Helper to get instrument names string for a member
  const getMemberInstrumentString = (member: BandMember) => {
    return member.instruments
      .map(slot => {
          const inst = INSTRUMENTS.find(i => i.id === slot.instrumentId);
          return inst ? (inst.group + (inst.variantLabel ? ` (${inst.variantLabel})` : '')) : 'Unknown';
      })
      .join(', ');
  };

  // Generate inputs based on members and their instruments
  const inputs: any[] = [];

  members.forEach((member) => {
    member.instruments.forEach((slot) => {
      // Get effective inputs (custom or defaults)
      const effectiveInputs = slot.inputs?.length
        ? slot.inputs
        : getDefaultInputsForSlot(slot, INSTRUMENTS);

      effectiveInputs.forEach((input) => {
        inputs.push({
          input: input.label,
          micDi: input.micDi,
          stand: input.stand,
          notes: input.notes || ''
        });
      });
    });
  });

  return (
    <div className="w-full">
      {/* Band Members Summary */}
      <div className="mb-6 bg-slate-50 p-4 border border-slate-200 rounded-lg print:border-black break-inside-avoid">
        <h4 className="font-bold text-black uppercase text-xs mb-3 border-b border-slate-200 pb-2">Band Members</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {members.map(member => (
            <div key={member.id} className="text-sm text-black flex">
              <span className="font-bold min-w-[80px]">{member.name}:</span>
              <span className="italic text-slate-700">{getMemberInstrumentString(member)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Input List Table */}
      <div className="w-full overflow-hidden rounded-lg border border-slate-200 print:border-black">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 print:bg-slate-200 print:text-black">
            <tr>
              <th className="py-2 px-3 font-bold border-r border-b border-slate-300 print:border-black text-black">Instrument</th>
              <th className="py-2 px-3 font-bold border-r border-b border-slate-300 print:border-black text-black">Mic / DI</th>
              <th className="py-2 px-3 font-bold border-b border-slate-300 print:border-black text-black">Notes</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input) => (
              <tr key={input.input} className="border-b border-slate-200 last:border-0 print:border-slate-400">
                <td className="py-2 px-3 text-black border-r border-slate-200 print:border-slate-400 font-medium">{input.input}</td>
                <td className="py-2 px-3 text-black border-r border-slate-200 print:border-slate-400">{input.micDi}</td>
                <td className="py-2 px-3 text-black italic print:text-black">{input.notes}</td>
              </tr>
            ))}
            {inputs.length === 0 && (
               <tr>
                 <td colSpan={3} className="py-4 text-center text-slate-400 italic">No instruments added yet.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};