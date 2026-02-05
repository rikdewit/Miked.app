import { useState, useCallback } from 'react';
import { RiderData, BandMember, StageItem, InstrumentType } from '../types';
import { INITIAL_RIDER_DATA, INSTRUMENTS } from '../constants';

export const useRiderState = () => {
  const [data, setData] = useState<RiderData>(INITIAL_RIDER_DATA);

  const addMember = useCallback(() => {
    const newMember: BandMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      instrumentIds: [INSTRUMENTS[0].id],
      notes: ''
    };
    setData(prev => ({ ...prev, members: [...prev.members, newMember] }));
  }, []);

  const applyRockTemplate = useCallback(() => {
    const newMembers: BandMember[] = [
      { id: Math.random().toString(36).substr(2, 9), name: 'Drummer', instrumentIds: ['drums'], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Bassist', instrumentIds: ['bass_amp'], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Guitarist', instrumentIds: ['gtr_amp'], notes: '' },
      { id: Math.random().toString(36).substr(2, 9), name: 'Lead Singer', instrumentIds: ['voc_lead'], notes: '' },
    ];
    setData(prev => ({ ...prev, members: newMembers }));
  }, []);

  const updateMemberName = useCallback((id: string, name: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, name } : m)
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
          return { ...m, instrumentIds: [...m.instrumentIds, INSTRUMENTS[0].id] };
        }
        return m;
      })
    }));
  }, []);

  const updateMemberInstrument = useCallback((memberId: string, index: number, instrumentId: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
          const newIds = [...m.instrumentIds];
          newIds[index] = instrumentId;
          return { ...m, instrumentIds: newIds };
        }
        return m;
      })
    }));
  }, []);

  const removeMemberInstrument = useCallback((memberId: string, index: number) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id === memberId) {
           const newIds = m.instrumentIds.filter((_, i) => i !== index);
           return { ...m, instrumentIds: newIds };
        }
        return m;
      })
    }));
  }, []);

  const removeMember = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id)
    }));
  }, []);

  const updateStageItems = useCallback((newItems: StageItem[]) => {
    setData(prev => ({ ...prev, stagePlot: newItems }));
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
    updateStageItems
  };
};