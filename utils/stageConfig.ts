import { StageItem } from '../types';

// --- Constants ---
export const STAGE_WIDTH = 8; // Wider stage for better spacing
export const STAGE_DEPTH = 5; 

// --- Color Palette ---
export const COLORS = {
  person: '#3b82f6',     // Blue 500
  amp: '#1e293b',        // Slate 800
  drum: '#ef4444',       // Red 500
  keys: '#8b5cf6',       // Violet 500
  mic: '#94a3b8',        // Slate 400
  instrument: '#fbbf24', // Amber 400
  pedalboard: '#111827', // Gray 900
  di: '#f97316',         // Orange 500
  monitor: '#374151',    // Gray 700
  power: '#eab308',      // Yellow 500
  stand: '#64748b'       // Slate 500
};

// --- Item Configuration Helper ---
export const getItemConfig = (item: StageItem) => {
  const isPerson = item.type === 'person';
  const isMonitor = item.type === 'monitor';
  const isPower = item.type === 'power';
  const label = (item.label || '').toLowerCase();

  // Specific Item Detection based on labels generated in StepStagePlot
  if (isPerson) {
    return { width: 0.5, depth: 0.5, height: 1.7, color: COLORS.person, shape: 'person' };
  } 
  
  if (isMonitor) {
    return { width: 0.6, depth: 0.4, height: 0.3, color: COLORS.monitor, shape: 'wedge' };
  }

  if (isPower) {
    return { width: 0.3, depth: 0.3, height: 0.3, color: COLORS.power, shape: 'box' };
  }

  // Instrument / Gear detection
  if (label.includes('amp')) {
    return { width: 0.7, depth: 0.4, height: 0.7, color: COLORS.amp, shape: 'box' };
  }
  if (label.includes('kit') || label.includes('drum')) {
    return { width: 1.8, depth: 1.5, height: 0.9, color: COLORS.drum, shape: 'box' };
  }
  if (label.includes('keys')) {
    return { width: 1.2, depth: 0.4, height: 0.9, color: COLORS.keys, shape: 'box' };
  }
  if (label.includes('di')) {
    return { width: 0.2, depth: 0.2, height: 0.1, color: COLORS.di, shape: 'box' };
  }
  if (label.includes('pedal') || label.includes('modeler')) {
    return { width: 0.6, depth: 0.3, height: 0.1, color: COLORS.pedalboard, shape: 'box' };
  }
  if (label.includes('mic')) {
    return { width: 0.2, depth: 0.2, height: 1.5, color: COLORS.mic, shape: 'pole' };
  }
  
  if (label.includes('gtr') || label.includes('guitar') || label.includes('bass') || label.includes('sax') || label.includes('tpt') || label.includes('brass')) {
     // Instrument on stand
     return { width: 0.4, depth: 0.3, height: 1.0, color: COLORS.instrument, shape: 'instrument' };
  }

  // Fallback
  return { width: 0.3, depth: 0.3, height: 0.3, color: '#cbd5e1', shape: 'box' };
};