import React from 'react';
import { BandMember } from '../types';
import { INSTRUMENTS } from '../constants';

interface InputListProps {
  members: BandMember[];
}

export const InputList: React.FC<InputListProps> = ({ members }) => {
  // Generate inputs based on members and their instruments
  let channelCounter = 1;
  
  const inputs = members.flatMap((member) => {
    return member.instrumentIds.map((instId) => {
      const instrument = INSTRUMENTS.find(i => i.id === instId);
      const inputDef = {
        channel: channelCounter++,
        source: member.name,
        instrument: instrument?.name || 'Unknown',
        micDi: instrument?.defaultDi ? 'DI' : (instrument?.defaultMic || 'Venue Tech'),
        stand: instrument?.type === 'Vocal' ? 'Tall Boom' : (instrument?.name.includes('Amp') ? 'Short Boom' : ''),
        notes: member.notes || ''
      };
      return inputDef;
    });
  });

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 print:border-black">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-700 print:bg-slate-200 print:text-black">
          <tr>
            <th className="py-2 px-3 font-bold w-12 border-r border-b border-slate-300 print:border-black">CH</th>
            <th className="py-2 px-3 font-bold border-r border-b border-slate-300 print:border-black">Member</th>
            <th className="py-2 px-3 font-bold border-r border-b border-slate-300 print:border-black">Instrument</th>
            <th className="py-2 px-3 font-bold border-r border-b border-slate-300 print:border-black">Mic / DI</th>
            <th className="py-2 px-3 font-bold border-b border-slate-300 print:border-black hidden sm:table-cell">Stand</th>
            <th className="py-2 px-3 font-bold border-b border-slate-300 print:border-black">Notes</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input) => (
            <tr key={input.channel} className="border-b border-slate-200 last:border-0 print:border-slate-400">
              <td className="py-2 px-3 font-mono font-bold border-r border-slate-200 print:border-slate-400">{input.channel}</td>
              <td className="py-2 px-3 border-r border-slate-200 print:border-slate-400">{input.source}</td>
              <td className="py-2 px-3 border-r border-slate-200 print:border-slate-400">{input.instrument}</td>
              <td className="py-2 px-3 border-r border-slate-200 print:border-slate-400">{input.micDi}</td>
               <td className="py-2 px-3 border-r border-slate-200 print:border-slate-400 hidden sm:table-cell">{input.stand}</td>
              <td className="py-2 px-3 text-slate-500 italic print:text-black">{input.notes}</td>
            </tr>
          ))}
          {inputs.length === 0 && (
             <tr>
               <td colSpan={6} className="py-4 text-center text-slate-400 italic">No instruments added yet.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};