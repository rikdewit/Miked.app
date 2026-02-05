import { InstrumentDefinition, InstrumentType } from './types';

export const INSTRUMENTS: InstrumentDefinition[] = [
  // Vocals
  { id: 'voc_lead', group: 'Vocals', name: 'Lead Vocals', type: InstrumentType.VOCAL, defaultMic: 'SM58/Beta58', requiresMonitor: true, icon: 'Mic' },
  { id: 'voc_back', group: 'Vocals', name: 'Backing Vocals', type: InstrumentType.VOCAL, defaultMic: 'SM58', requiresMonitor: true, icon: 'Mic' },
  
  // Electric Guitar
  { id: 'gtr_amp', group: 'Electric Guitar', variantLabel: '1 Amp', name: 'Electric Guitar (Amp)', type: InstrumentType.GUITAR, defaultMic: 'SM57 / e609', icon: 'Guitar' },
  { id: 'gtr_amp_2', group: 'Electric Guitar', variantLabel: '2 Amps', name: 'Electric Guitar (2 Amps)', type: InstrumentType.GUITAR, defaultMic: '2x SM57', icon: 'Guitar' },
  { id: 'gtr_modeler', group: 'Electric Guitar', variantLabel: 'Modeler (DI)', name: 'Electric Guitar (Modeler)', type: InstrumentType.GUITAR, defaultDi: true, icon: 'Guitar' },
  
  // Acoustic Guitar
  { id: 'gtr_ac', group: 'Acoustic Guitar', name: 'Acoustic Guitar', type: InstrumentType.GUITAR, defaultDi: true, requiresMonitor: true, icon: 'Guitar' },
  
  // Bass
  { id: 'bass_amp', group: 'Bass Guitar', variantLabel: 'Amp Only', name: 'Bass (Amp)', type: InstrumentType.BASS, defaultMic: 'D112 / Beta52', icon: 'Speaker' },
  { id: 'bass_di', group: 'Bass Guitar', variantLabel: 'DI Only', name: 'Bass (DI)', type: InstrumentType.BASS, defaultDi: true, icon: 'Speaker' },
  { id: 'bass_combined', group: 'Bass Guitar', variantLabel: 'Amp + DI', name: 'Bass (Amp + DI)', type: InstrumentType.BASS, defaultDi: true, defaultMic: 'D112', icon: 'Speaker' },
  
  // Drums
  { id: 'drums', group: 'Drums', name: 'Drum Kit (Standard)', type: InstrumentType.DRUMS, defaultMic: 'Kick, Snare, OH L/R', requiresMonitor: true, icon: 'Drum' },
  
  // Keys
  { id: 'keys_mono', group: 'Keys / Synth', variantLabel: 'Mono', name: 'Keys (Mono)', type: InstrumentType.KEYS, defaultDi: true, requiresMonitor: true, icon: 'Music' },
  { id: 'keys_stereo', group: 'Keys / Synth', variantLabel: 'Stereo', name: 'Keys (Stereo)', type: InstrumentType.KEYS, defaultDi: true, requiresMonitor: true, icon: 'Music' },
  
  // Brass - Sax
  { id: 'sax_mic', group: 'Saxophone', variantLabel: 'Mic on Stand', name: 'Saxophone (Stand Mic)', type: InstrumentType.BRASS, defaultMic: 'RE20 / MD421', icon: 'Music' },
  { id: 'sax_clip', group: 'Saxophone', variantLabel: 'Clip-on', name: 'Saxophone (Clip-on)', type: InstrumentType.BRASS, defaultMic: 'Clip-on (XLR)', icon: 'Music' },
  
  // Brass - Trumpet
  { id: 'tpt_mic', group: 'Trumpet', variantLabel: 'Mic on Stand', name: 'Trumpet (Stand Mic)', type: InstrumentType.BRASS, defaultMic: 'SM57 / MD421', icon: 'Music' },
  { id: 'tpt_clip', group: 'Trumpet', variantLabel: 'Clip-on', name: 'Trumpet (Clip-on)', type: InstrumentType.BRASS, defaultMic: 'Clip-on (XLR)', icon: 'Music' },
  
  // Other
  { id: 'dj', group: 'DJ / Playback', name: 'DJ Set', type: InstrumentType.OTHER, defaultDi: true, requiresMonitor: true, icon: 'Disc' },
  { id: 'laptop', group: 'DJ / Playback', name: 'Laptop / Tracks', type: InstrumentType.OTHER, defaultDi: true, icon: 'Laptop' },
];

export const INITIAL_RIDER_DATA = {
  members: [],
  stagePlot: [],
  details: {
    bandName: '',
    contactName: '',
    email: '',
    generalNotes: '',
    showDuration: '',
    soundcheckDuration: '',
  },
};