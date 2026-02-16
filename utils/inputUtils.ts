import { InstrumentSlot, InputConfig, InstrumentDefinition } from '../types';

/**
 * Generate default inputs for an instrument slot.
 * This logic was extracted from InputList.tsx to be reused in StepInstruments.
 */
export function getDefaultInputsForSlot(
  slot: InstrumentSlot,
  instruments: InstrumentDefinition[]
): InputConfig[] {
  const instId = slot.instrumentId;
  const inputs: InputConfig[] = [];

  // Handle Drums Splitting (7 inputs)
  if (instId === 'drums') {
    const drumChannels = [
      { label: 'Kick', micDi: 'D112 MKII', stand: 'Short Boom' },
      { label: 'Snare', micDi: 'SM57', stand: 'Short Boom' },
      { label: 'Tom 1', micDi: 'e604', stand: 'Clip-on' },
      { label: 'Tom 2', micDi: 'e604', stand: 'Clip-on' },
      { label: 'Floor Tom', micDi: 'e604', stand: 'Clip-on' },
      { label: 'OH L', micDi: 'Condenser', stand: 'Tall Boom' },
      { label: 'OH R', micDi: 'Condenser', stand: 'Tall Boom' },
    ];

    return drumChannels.map((kit) => ({
      ...kit,
      notes: ''
    }));
  }

  // Handle DJ (always 2 channels: DJ L and DJ R)
  if (instId === 'dj') {
    return [
      {
        label: 'DJ L',
        micDi: 'DI',
        stand: '',
        notes: ''
      },
      {
        label: 'DJ R',
        micDi: 'DI',
        stand: '',
        notes: ''
      }
    ];
  }

  // Handle Stereo Keys Splitting (2 inputs)
  if (instId === 'keys_stereo') {
    return [
      {
        label: 'Keys L',
        micDi: 'DI',
        stand: '',
        notes: ''
      },
      {
        label: 'Keys R',
        micDi: 'DI',
        stand: '',
        notes: ''
      }
    ];
  }

  // Handle Stereo Tracks Splitting (2 inputs)
  if (instId === 'tracks_stereo') {
    return [
      {
        label: 'Tracks L',
        micDi: 'DI',
        stand: '',
        notes: ''
      },
      {
        label: 'Tracks R',
        micDi: 'DI',
        stand: '',
        notes: ''
      }
    ];
  }

  // Handle Guitar 2 Amps (2 inputs)
  if (instId === 'gtr_amp_2') {
    return [
      {
        label: 'Electric Guitar Amp 1',
        micDi: 'SM57',
        stand: 'Short Boom',
        notes: ''
      },
      {
        label: 'Electric Guitar Amp 2',
        micDi: 'SM57',
        stand: 'Short Boom',
        notes: ''
      }
    ];
  }

  // Handle Guitar Modeller Stereo (2 inputs)
  if (instId === 'gtr_modeler_stereo') {
    return [
      {
        label: 'Modeller L',
        micDi: 'DI',
        stand: '',
        notes: ''
      },
      {
        label: 'Modeller R',
        micDi: 'DI',
        stand: '',
        notes: ''
      }
    ];
  }

  // Handle Bass Combined (2 inputs: DI + Amp)
  if (instId === 'bass_combined') {
    return [
      {
        label: 'Bass DI',
        micDi: 'DI',
        stand: '',
        notes: ''
      },
      {
        label: 'Bass Amp',
        micDi: 'D112 MKII',
        stand: 'Short Boom',
        notes: ''
      }
    ];
  }

  // Handle Standard Instruments (1 input)
  const instrument = instruments.find(i => i.id === instId);
  if (instrument) {
    let micDi = '';
    let stand = '';

    // Better defaults based on instrument type
    if (instrument.defaultDi) {
      micDi = 'DI';
    } else if (instrument.type === 'Vocal') {
      micDi = 'SM58';
    } else if (instrument.id.includes('gtr_amp')) {
      micDi = 'SM57';
    } else if (instrument.id.includes('bass_') && instrument.id !== 'bass_combined') {
      micDi = 'D112 MKII';
    } else {
      micDi = instrument.defaultMic || '';
    }

    // Logic to determine stand based on instrument type/variant
    if (instrument.type === 'Vocal') {
      stand = 'Tall Boom';
    } else if (instrument.id.includes('amp')) {
      stand = 'Short Boom';
    } else if (instrument.id.includes('stand')) {
      stand = 'Tall Boom';
    } else if (instrument.id.includes('clip')) {
      stand = 'Clip-on';
    }

    inputs.push({
      label: instrument.group,
      micDi: micDi,
      stand: stand,
      notes: ''
    });
  }

  return inputs;
}
