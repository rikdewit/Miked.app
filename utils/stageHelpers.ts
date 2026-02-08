
import { BandMember, StageItem, InstrumentType } from '../types';
import { STAGE_WIDTH, STAGE_DEPTH } from './stageConfig';
import { INSTRUMENTS } from '../constants';

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

    member.instrumentIds.forEach((instId, idx) => {
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
            const diLabel = instId.includes('stereo') ? 'Stereo DI' : 'DI';
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
           const ampX = startX + (ampCount % 2 === 0 ? -12 : 12);
           items.push({ id: `amp-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Amp', x: ampX, y: startY - 10, fromInstrumentIndex: idx, isPeripheral: true });
           ampCount++;
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

            // Pedalboard / Modeler (Peripheral)
            if (instId.includes('modeler')) {
                 items.push({ id: `mod-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Modeler', x: startX + spreadX, y: startY + 8, fromInstrumentIndex: idx, isPeripheral: true });
            } else if (inst.type !== InstrumentType.BRASS && inst.id !== 'gtr_ac') {
                 items.push({ id: `pedal-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'Pedals', x: startX + spreadX, y: startY + 8, fromInstrumentIndex: idx, isPeripheral: true });
            }
            
            // DI Box (Peripheral)
            if (inst.defaultDi || instId.includes('di')) {
                 items.push({ id: `di-${baseId}-${idx}`, memberId: member.id, type: 'member', label: 'DI', x: startX + spreadX + (isRight?2:-2), y: startY + 5, fromInstrumentIndex: idx, isPeripheral: true });
            }
        }
    });

    return items;
};
