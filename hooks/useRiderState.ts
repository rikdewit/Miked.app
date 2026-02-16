
import { useState, useCallback } from 'react';
import { RiderData, BandMember, StageItem, InstrumentType, InputConfig } from '../types';
import { INITIAL_RIDER_DATA, INSTRUMENTS } from '../constants';

export const useRiderState = () => {
  const [data, setData] = useState<RiderData>(INITIAL_RIDER_DATA);

  const addMember = useCallback(() => {
    const newMember: BandMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      instruments: [{ instrumentId: INSTRUMENTS[0].id }],
      notes: ''
    };
    setData(prev => ({ ...prev, members: [...prev.members, newMember] }));
  }, []);

  const applyRockTemplate = useCallback(() => {
    const newMembers: BandMember[] = [
      { id: Math.random().toString(36).substr(2, 9), name: 'Drummer', instruments: [{ instrumentId: 'drums' }], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Bassist', instruments: [{ instrumentId: 'bass_amp' }], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Guitarist', instruments: [{ instrumentId: 'gtr_amp' }], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Lead Singer', instruments: [{ instrumentId: 'voc_lead' }], notes: '' },
    ];
    // Reset members AND clear stage plot entirely when applying a full template
    setData(prev => ({ ...prev, members: newMembers, stagePlot: [] }));
  }, []);

  const updateMemberName = useCallback((id: string, name: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, name } : m),
      // Also update labels on stage if they exist
      stagePlot: prev.stagePlot.map(item => {
        if (item.memberId === id && item.type === 'person') {
            return { ...item, label: name };
        }
        return item;
      })
    }));
  }, []);

  const updateMemberNotes = useCallback((id: string, notes: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, notes } : m)
    }));
  }, []);

  const addMemberInstrument = useCallback((memberId: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          return { ...m, instruments: [...m.instruments, { instrumentId: INSTRUMENTS[0].id }] };
        }
        return m;
      }),
      // No stage items to remove when adding a new instrument slot
    }));
  }, []);

  const updateMemberInstrument = useCallback((memberId: string, index: number, newInstrumentId: string) => {
    setData(prev => {
      const member = prev.members.find(m => m.id === memberId);
      if (!member) return prev;

      const oldInstrumentId = member.instruments[index].instrumentId;
      const oldInstDef = INSTRUMENTS.find(i => i.id === oldInstrumentId);
      const newInstDef = INSTRUMENTS.find(i => i.id === newInstrumentId);

      // Determine cleanup strategy
      // If Types match (e.g. Guitar -> Guitar), we only remove "Peripheral" items (Amp).
      // If Types differ (e.g. Guitar -> Keys), we remove ALL items for this slot.
      const sameType = oldInstDef && newInstDef && oldInstDef.type === newInstDef.type;

      // Update Member
      const updatedMembers = prev.members.map(m => {
        if (m.id === memberId) {
          const newSlots = [...m.instruments];
          // When changing instrument, reset inputs to defaults
          newSlots[index] = { ...newSlots[index], instrumentId: newInstrumentId, inputs: undefined };
          return { ...m, instruments: newSlots };
        }
        return m;
      });

      // Update Stage Plot
      let updatedStagePlot = prev.stagePlot.filter(item => {
        // If it's not this member, keep it
        if (item.memberId !== memberId) return true;
        
        // If it's the Person, keep it
        if (item.type === 'person') return true;

        // If it belongs to a different instrument index, keep it
        if (item.fromInstrumentIndex !== index) return true;

        // If it belongs to THIS instrument index:
        if (sameType) {
            // Same type: Remove only Peripherals (e.g. Amp), Keep Core (e.g. Guitar Body)
            return !item.isPeripheral;
        } else {
            // Different type: Remove everything for this instrument
            return false;
        }
      });

      // Update labels for core items if instrument changed
      updatedStagePlot = updatedStagePlot.map(item => {
        if (item.memberId === memberId && item.fromInstrumentIndex === index && !item.isPeripheral) {
            return { ...item, label: newInstDef?.group || item.label };
        }
        return item;
      });

      return {
        ...prev,
        members: updatedMembers,
        stagePlot: updatedStagePlot
      };
    });
  }, []);

  const removeMemberInstrument = useCallback((memberId: string, indexToRemove: number) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
           const newSlots = m.instruments.filter((_, i) => i !== indexToRemove);
           return { ...m, instruments: newSlots };
        }
        return m;
      }),
      // Remove items for the deleted index, and shift indices for subsequent items
      stagePlot: prev.stagePlot
        .filter(item => {
            if (item.memberId !== memberId) return true;
            // Remove items belonging to the deleted slot
            if (item.fromInstrumentIndex === indexToRemove) return false;
            return true;
        })
        .map(item => {
            if (item.memberId === memberId && item.fromInstrumentIndex !== undefined && item.fromInstrumentIndex > indexToRemove) {
                // Shift index down to match new array
                return { ...item, fromInstrumentIndex: item.fromInstrumentIndex - 1 };
            }
            return item;
        })
    }));
  }, []);

  const removeMember = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id),
      // Remove everything for this member
      stagePlot: prev.stagePlot.filter(item => item.memberId !== id)
    }));
  }, []);

  const updateStageItems = useCallback((newItems: StageItem[]) => {
    setData(prev => ({ ...prev, stagePlot: newItems }));
  }, []);

  const updateInstrumentNotes = useCallback((memberId: string, index: number, notes: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          const newSlots = [...m.instruments];
          newSlots[index] = { ...newSlots[index], notes };
          return { ...m, instruments: newSlots };
        }
        return m;
      })
    }));
  }, []);

  const updateInstrumentInputs = useCallback((memberId: string, index: number, inputs: InputConfig[]) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          const newSlots = [...m.instruments];
          newSlots[index] = { ...newSlots[index], inputs };
          return { ...m, instruments: newSlots };
        }
        return m;
      })
    }));
  }, []);

  return {
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
    updateStageItems,
    updateInstrumentNotes,
    updateInstrumentInputs
  };
};
