import { InstrumentDefinition, InstrumentType } from './types';

// ─── Stage Plot Camera Settings ───────────────────────────────────────────────
// Adjust these to change how the stage is framed in each view/mode.
// padding: fraction of extra space around the stage (0.1 = 10%)
// modelHeight: how many world-units above the stage floor to include in the
//              zoom-to-fit bounding box (accounts for 3D model height)
// position: [x, y, z] camera world position
// lookAt: [x, y, z] point the camera looks at

export const CAMERA_TOP_INTERACTIVE = {
  position: [0, 30, -1] as [number, number, number],
  lookAt: [0, -20, 1] as [number, number, number],
  padding: 0.2,
  modelHeight: 0,
};

export const CAMERA_TOP_PREVIEW = {
  position: [0, 30, -1] as [number, number, number],
  lookAt: [0, -20, 1] as [number, number, number],
  padding: 0.2,
  modelHeight: 0,
};

export const CAMERA_ISO_INTERACTIVE = {
  position: [-20, 30, 20] as [number, number, number],
  lookAt: [0, 1, 0] as [number, number, number],
  padding: 0.2,
  modelHeight: 3,
};

export const CAMERA_ISO_PREVIEW = {
  position: [-20, 30, 20] as [number, number, number],
  lookAt: [0, 1, 0] as [number, number, number],
  padding: 0.2,
  modelHeight: 3,
};

// ─── Font Size Adjustments ────────────────────────────────────────────────────
// Scale factors for text rendering in preview vs interactive modes
// Model labels (on stage items like "Lead Vocals", "Guitar", etc.)
export const MODEL_LABEL_FONT_SCALE_INTERACTIVE = 1.3;
export const MODEL_LABEL_FONT_SCALE_PREVIEW = 3;

// Audience text (the "AUDIENCE" label in front of stage)
export const AUDIENCE_TEXT_FONT_SCALE_INTERACTIVE = 1;
export const AUDIENCE_TEXT_FONT_SCALE_PREVIEW = 1;
// ──────────────────────────────────────────────────────────────────────────────


export const INSTRUMENTS: InstrumentDefinition[] = [
  // Vocals
  { id: 'voc_lead', group: 'Vocals', name: 'Lead Vocals', type: InstrumentType.VOCAL, defaultMic: 'SM58/Beta58', requiresMonitor: true, icon: 'Mic' },
  { id: 'voc_back', group: 'Vocals', name: 'Backing Vocals', type: InstrumentType.VOCAL, defaultMic: 'SM58', requiresMonitor: true, icon: 'Mic' },
  
  // Electric Guitar
  { id: 'gtr_amp', group: 'Electric Guitar', variantLabel: 'amp', name: 'Electric Guitar (Amp)', type: InstrumentType.GUITAR, defaultMic: 'SM57 / e609', icon: 'Guitar' },
  { id: 'gtr_amp_2', group: 'Electric Guitar', variantLabel: '2 Amps', name: 'Electric Guitar (2 Amps)', type: InstrumentType.GUITAR, defaultMic: '2x SM57', icon: 'Guitar' },
  { id: 'gtr_modeler_mono', group: 'Electric Guitar', variantLabel: 'Modeller (Mono)', name: 'Electric Guitar (Modeller Mono)', type: InstrumentType.GUITAR, defaultDi: true, icon: 'Guitar' },
  { id: 'gtr_modeler_stereo', group: 'Electric Guitar', variantLabel: 'Modeller (Stereo)', name: 'Electric Guitar (Modeller Stereo)', type: InstrumentType.GUITAR, defaultDi: true, icon: 'Guitar' },
  
  // Acoustic Guitar
  { id: 'gtr_ac', group: 'Acoustic Guitar', name: 'Acoustic Guitar', type: InstrumentType.GUITAR, defaultDi: true, requiresMonitor: true, icon: 'Guitar' },
  
  // Bass
  { id: 'bass_amp', group: 'Bass Guitar', variantLabel: 'amp', name: 'Bass (Amp)', type: InstrumentType.BASS, defaultMic: 'D112 / Beta52', icon: 'Speaker' },
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
  
  // DJ
  { id: 'dj', group: 'DJ', name: 'DJ Set', type: InstrumentType.OTHER, defaultMic: 'XLR', defaultDi: true, requiresMonitor: true, icon: 'Disc' },

  // Tracks
  { id: 'tracks_mono', group: 'Tracks', variantLabel: 'Mono', name: 'Tracks (Mono)', type: InstrumentType.OTHER, defaultDi: true, icon: 'Laptop' },
  { id: 'tracks_stereo', group: 'Tracks', variantLabel: 'Stereo', name: 'Tracks (Stereo)', type: InstrumentType.OTHER, defaultDi: true, icon: 'Laptop' },
];

export const INITIAL_RIDER_DATA = {
  members: [],
  stagePlot: [],
  details: {
    bandName: '',
    contactName: '',
    email: '',
    generalNotes: '',
    technicalNotes: '',
    showDuration: '',
    soundcheckDuration: '',
    stageDimensionUnit: 'm' as const,
  },
};