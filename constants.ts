import { InstrumentDefinition, InstrumentType } from './types';
import { Mic, Guitar, Speaker, Music, Drum, User } from 'lucide-react';

export const INSTRUMENTS: InstrumentDefinition[] = [
  { id: 'voc_lead', name: 'Lead Vocals', type: InstrumentType.VOCAL, defaultMic: 'SM58/Beta58', requiresMonitor: true, icon: 'Mic' },
  { id: 'voc_back', name: 'Backing Vocals', type: InstrumentType.VOCAL, defaultMic: 'SM58', requiresMonitor: true, icon: 'Mic' },
  { id: 'gtr_elec', name: 'Electric Guitar', type: InstrumentType.GUITAR, defaultMic: 'SM57 / e609', icon: 'Guitar' },
  { id: 'gtr_ac', name: 'Acoustic Guitar', type: InstrumentType.GUITAR, defaultDi: true, requiresMonitor: true, icon: 'Guitar' },
  { id: 'bass', name: 'Bass Guitar', type: InstrumentType.BASS, defaultDi: true, defaultMic: 'D112 / Beta52', icon: 'Speaker' },
  { id: 'drums', name: 'Drum Kit (Standard)', type: InstrumentType.DRUMS, defaultMic: 'Kick, Snare, OH L/R', requiresMonitor: true, icon: 'Drum' },
  { id: 'keys_l', name: 'Keys (Left/Mono)', type: InstrumentType.KEYS, defaultDi: true, requiresMonitor: true, icon: 'Music' },
  { id: 'keys_stereo', name: 'Keys (Stereo)', type: InstrumentType.KEYS, defaultDi: true, requiresMonitor: true, icon: 'Music' },
  { id: 'sax', name: 'Saxophone', type: InstrumentType.BRASS, defaultMic: 'Clip-on / RE20', icon: 'Music' },
  { id: 'trumpet', name: 'Trumpet', type: InstrumentType.BRASS, defaultMic: 'SM57 / MD421', icon: 'Music' },
  { id: 'dj', name: 'DJ Set', type: InstrumentType.OTHER, defaultDi: true, requiresMonitor: true, icon: 'Disc' },
  { id: 'laptop', name: 'Laptop / Backing Tracks', type: InstrumentType.OTHER, defaultDi: true, icon: 'Laptop' },
];

export const INITIAL_RIDER_DATA = {
  members: [],
  stagePlot: [],
  details: {
    bandName: '',
    contactName: '',
    email: '',
    generalNotes: '',
  },
};
