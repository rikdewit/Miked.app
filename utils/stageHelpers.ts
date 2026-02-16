
import { BandMember, StageItem, InstrumentType, PersonPose } from '../types';
import { STAGE_WIDTH, STAGE_DEPTH } from './stageConfig';
import { INSTRUMENTS } from '../constants';

// --- Instrument Equipment Helpers ---
export const getAmpCount = (instId: string): number => {
  // gtr_amp_2 has 2 amps, all others with 'amp' have 1
  return instId === 'gtr_amp_2' ? 2 : 1;
};

export const getDiInputCount = (instId: string): number => {
  if (instId === 'dj') return 2; // DJ L + DJ R
  if (instId === 'keys_stereo') return 2; // Keys L + Keys R
  if (instId === 'tracks_stereo') return 2; // Tracks L + Tracks R
  if (instId === 'gtr_modeler_stereo') return 2; // Modeller L + Modeller R
  if (instId === 'bass_combined') return 2; // Bass DI + Bass Amp (though amp is mic)
  return 1; // Everything else with DI is mono
};

export const getDiLabel = (instId: string): string => {
  const count = getDiInputCount(instId);
  return count > 1 ? `DI (${count})` : 'DI';
};

export const shouldCreateModeller = (instId: string): boolean => {
  return instId.includes('modeler');
};

// --- Coordinate Helpers (Data % <-> World) ---
export const percentToX = (p: number) => ((p / 100) * STAGE_WIDTH) - (STAGE_WIDTH / 2);
export const percentToZ = (p: number) => ((p / 100) * STAGE_DEPTH) - (STAGE_DEPTH / 2);
export const xToPercent = (w: number) => ((w + (STAGE_WIDTH / 2)) / STAGE_WIDTH) * 100;
export const zToPercent = (w: number) => ((w + (STAGE_DEPTH / 2)) / STAGE_DEPTH) * 100;

// --- Logic to generate individual items for a member ---
export const generateMemberItems = (member: BandMember, startX: number, startY: number, idBaseOverride?: string): StageItem[] => {
    const items: StageItem[] = [];
    const baseId = idBaseOverride || `${member.id}-${Date.now()}`;

    // 1. The Person (No instrument Index)
    items.push({ 
        id: `person-${baseId}`, 
        memberId: member.id, 
        type: 'person', 
        label: member.name || 'Musician', 
        x: startX, 
        y: startY,
        isPeripheral: false 
    });

    // 2. Instruments & Gear
    let ampCount = 0;
    let hasAssignedHeld = false; // Flag to ensure only one instrument is "held"

    member.instruments.forEach((slot, idx) => {
        const instId = slot.instrumentId;
        const inst = INSTRUMENTS.find(i => i.id === instId);
        if (!inst) return;

        // Offsets to spread items around the person
        const isRight = idx % 2 === 0;
        const spreadX = isRight ? 8 : -8; 
        
        // Note: Drums, Keys (main body), and Vocals are now part of the Person model, 
        // so we do not generate separate stage items for them.

        // KEYS - Only add peripherals like DI
        if (inst.type === InstrumentType.KEYS) {
            // Add DI Box for Keys
            const diInputCount = instId.includes('stereo') ? 2 : 1;
            const diLabel = diInputCount > 1 ? `DI (${diInputCount})` : 'DI';
            items.push({
                id: `di-${baseId}-${idx}`,
                memberId: member.id,
                type: 'member',
                label: diLabel,
                x: startX + spreadX + (isRight ? 3 : -3),
                y: startY + 5,
                fromInstrumentIndex: idx,
                isPeripheral: true
            });
        }

        // AMPS
        else if (instId.includes('amp') || instId.includes('combined')) {
           const numAmps = getAmpCount(instId);
           for (let ampIdx = 0; ampIdx < numAmps; ampIdx++) {
               const ampX = startX + (ampCount % 2 === 0 ? -12 : 12);
               items.push({ id: `amp-${baseId}-${idx}-${ampIdx}`, memberId: member.id, type: 'member', label: 'Amp', x: ampX, y: startY - 10, fromInstrumentIndex: idx, isPeripheral: true });
               ampCount++;
           }
        }

        // INSTRUMENTS ON STANDS OR HELD (Guitar/Bass/Brass)
        if ([InstrumentType.GUITAR, InstrumentType.BASS, InstrumentType.BRASS].includes(inst.type)) {
            let isHeld = false;
            
            // If we haven't assigned a handheld instrument yet, this one becomes held.
            if (!hasAssignedHeld) {
                hasAssignedHeld = true;
                isHeld = true;
            }

            if (!isHeld) {
                // Instrument Body on Stand (Core)
                items.push({ 
                    id: `inst-${baseId}-${idx}`, 
                    memberId: member.id, 
                    type: 'member', 
                    label: inst.group, // Use Group Name (e.g. "Acoustic Guitar") instead of Type ("Guitar")
                    x: startX + spreadX, 
                    y: startY - 5,
                    fromInstrumentIndex: idx,
                    isPeripheral: false 
                });
            }

            // Pedalboard / Modeller (Peripheral)
            if (shouldCreateModeller(instId)) {
                 items.push({ id: `mod-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Modeller', x: startX + spreadX, y: startY + 8, fromInstrumentIndex: idx, isPeripheral: true });
            } else if (inst.type !== InstrumentType.BRASS && inst.id !== 'gtr_ac') {
                 items.push({ id: `pedal-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Pedals', x: startX + spreadX, y: startY + 8, fromInstrumentIndex: idx, isPeripheral: true });
            }
            
            // DI Box (Peripheral)
            if (inst.defaultDi || instId.includes('di')) {
                 const diLabel = getDiLabel(instId);
                 items.push({ id: `di-${baseId}-${idx}`, memberId: member.id, type: 'member', label: diLabel, x: startX + spreadX + (isRight?2:-2), y: startY + 5, fromInstrumentIndex: idx, isPeripheral: true });
            }
        }
    });

    return items;
};

// --- Helper to determine Person Pose based on instruments ---
export const getPersonPose = (member: BandMember): { pose: PersonPose; heldInstrumentId?: string } => {
    let pose: PersonPose = 'stand';
    let heldInstrumentId: string | undefined;

    // 1. Roles (Drums, Keys, DJ, Vocals)
    const hasDrums = member.instruments.some(slot => INSTRUMENTS.find(i => i.id === slot.instrumentId)?.type === InstrumentType.DRUMS);
    const hasKeys = member.instruments.some(slot => INSTRUMENTS.find(i => i.id === slot.instrumentId)?.type === InstrumentType.KEYS);
    const hasDj = member.instruments.some(slot => slot.instrumentId === 'dj');
    const hasVocal = member.instruments.some(slot => INSTRUMENTS.find(i => i.id === slot.instrumentId)?.type === InstrumentType.VOCAL);

    if (hasDrums) {
        pose = 'drums';
    } else if (hasDj) {
        pose = 'dj';
    } else if (hasKeys) {
        pose = 'keys';
    } else {
        // 2. Held Instruments (Guitar, Bass, Brass)
        const heldSlot = member.instruments.find(slot => {
            const inst = INSTRUMENTS.find(i => i.id === slot.instrumentId);
            return inst && [InstrumentType.GUITAR, InstrumentType.BASS, InstrumentType.BRASS].includes(inst.type);
        });
        heldInstrumentId = heldSlot?.instrumentId;

        if (heldInstrumentId) {
            const inst = INSTRUMENTS.find(i => i.id === heldInstrumentId);
            const labelLower = (inst?.group || '').toLowerCase();
            
            if (inst?.type === InstrumentType.BASS) pose = 'bass';
            else if (inst?.id === 'gtr_ac' || labelLower.includes('acoustic')) pose = 'acoustic';
            else if (inst?.type === InstrumentType.GUITAR) pose = 'guitar';
            else if (labelLower.includes('trumpet') || labelLower.includes('tpt')) pose = 'trumpet';
            else if (labelLower.includes('sax')) pose = 'sax';
        } else if (hasVocal) {
            pose = 'singing';
        }
    }

    return { pose, heldInstrumentId };
};
