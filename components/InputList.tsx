import React from 'react';
import { BandMember } from '../types';
import { INSTRUMENTS } from '../constants';

interface InputListProps {
  members: BandMember[];
}

export const InputList: React.FC<InputListProps> = ({ members }) => {
  // Helper to get instrument names string for a member
  const getMemberInstrumentString = (member: BandMember) => {
    return member.instrumentIds
      .map(id => {
          const inst = INSTRUMENTS.find(i => i.id === id);
          return inst ? (inst.group + (inst.variantLabel ? ` (${inst.variantLabel})` : '')) : 'Unknown';
      })
      .join(', ');
  };

  // Generate inputs based on members and their instruments
  let channelCounter = 1;
  const inputs: any[] = [];

  members.forEach((member) => {
    member.instrumentIds.forEach((instId) => {
      // Handle Drums Splitting
      if (instId === 'drums') {
        const drumChannels = [
          { name: 'Kick', mic: 'Beta52 / D112', stand: 'Short Boom' },
          { name: 'Snare', mic: 'SM57', stand: 'Short Boom' },
          { name: 'Tom 1', mic: 'e604 / Clip', stand: 'Clip' },
          { name: 'Tom 2', mic: 'e604 / Clip', stand: 'Clip' },
          { name: 'Floor Tom', mic: 'e604 / Clip', stand: 'Clip' },
          { name: 'OH L', mic: 'Condenser', stand: 'Tall Boom' },
          { name: 'OH R', mic: 'Condenser', stand: 'Tall Boom' },
        ];

        drumChannels.forEach((kitPiece, idx) => {
          inputs.push({
            channel: channelCounter++,
            instrument: kitPiece.name,
            micDi: kitPiece.mic,
            stand: kitPiece.stand,
            notes: idx === 0 ? member.notes : '' 
          });
        });
        return;
      } 
      
      // Handle Stereo Keys Splitting
      if (instId === 'keys_stereo') {
          inputs.push({
            channel: channelCounter++,
            instrument: 'Keys L',
            micDi: 'DI',
            stand: '',
            notes: member.notes
          });
          inputs.push({
            channel: channelCounter++,
            instrument: 'Keys R',
            micDi: 'DI',
            stand: '',
            notes: ''
          });
          return;
      }

      // Handle Standard Instruments
      const instrument = INSTRUMENTS.find(i => i.id === instId);
      if (instrument) {
        let micDi = instrument.defaultDi ? 'DI' : (instrument.defaultMic || 'Venue Tech');
        let stand = '';

        // Logic to determine mic/stand based on instrument type/variant
        if (instrument.type === 'Vocal') {
            stand = 'Tall Boom';
        } else if (instrument.id.includes('amp')) {
            stand = 'Short Boom';
        } else if (instrument.id.includes('stand')) {
            stand = 'Tall Boom'; // Horns on stand
        } else if (instrument.id.includes('clip')) {
            stand = 'Clip-on';
        }

        // Bass Combined Special Case
        if (instrument.id === 'bass_combined') {
            micDi = 'DI + Mic (D112)';
            stand = 'Short Boom';
        }

        inputs.push({
          channel: channelCounter++,
          instrument: instrument.group, // Use Group Name for cleaner list (e.g. "Electric Guitar" instead of "Electric Guitar (Amp)")
          micDi: micDi,
          stand: stand,
          notes: member.notes || ''
        });
      }
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
              <th className="py-2 px-3 font-bold w-12 border-r border-b border-slate-300 print:border-black text-black">CH</th>
              <th className="py-2 px-3 font-bold border-r border-b border-slate-300 print:border-black text-black">Instrument</th>
              <th className="py-2 px-3 font-bold border-r border-b border-slate-300 print:border-black text-black">Mic / DI</th>
              <th className="py-2 px-3 font-bold border-b border-slate-300 print:border-black hidden sm:table-cell text-black">Stand</th>
              <th className="py-2 px-3 font-bold border-b border-slate-300 print:border-black text-black">Notes</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input) => (
              <tr key={input.channel} className="border-b border-slate-200 last:border-0 print:border-slate-400">
                <td className="py-2 px-3 font-mono font-bold text-black border-r border-slate-200 print:border-slate-400">{input.channel}</td>
                <td className="py-2 px-3 text-black border-r border-slate-200 print:border-slate-400 font-medium">{input.instrument}</td>
                <td className="py-2 px-3 text-black border-r border-slate-200 print:border-slate-400">{input.micDi}</td>
                <td className="py-2 px-3 text-black border-r border-slate-200 print:border-slate-400 hidden sm:table-cell">{input.stand}</td>
                <td className="py-2 px-3 text-black italic print:text-black">{input.notes}</td>
              </tr>
            ))}
            {inputs.length === 0 && (
               <tr>
                 <td colSpan={5} className="py-4 text-center text-slate-400 italic">No instruments added yet.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};