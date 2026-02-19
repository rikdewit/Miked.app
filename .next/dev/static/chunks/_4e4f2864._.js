(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/utils/stageConfig.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COLORS",
    ()=>COLORS,
    "STAGE_DEPTH",
    ()=>STAGE_DEPTH,
    "STAGE_WIDTH",
    ()=>STAGE_WIDTH,
    "getItemConfig",
    ()=>getItemConfig
]);
const STAGE_WIDTH = 8; // Wider stage for better spacing
const STAGE_DEPTH = 5;
const COLORS = {
    person: '#3b82f6',
    amp: '#1e293b',
    drum: '#ef4444',
    keys: '#8b5cf6',
    mic: '#94a3b8',
    instrument: '#cbd5e1',
    pedalboard: '#111827',
    di: '#f97316',
    monitor: '#374151',
    power: '#eab308',
    stand: '#64748b' // Slate 500
};
const getItemConfig = (item)=>{
    if (item.type === 'custom') {
        const w = item.customWidth ?? 0;
        const d = item.customDepth ?? 0;
        if (w === 0 && d === 0) {
            return {
                width: 0.3,
                depth: 0.3,
                height: 0.01,
                color: 'transparent',
                shape: 'box'
            };
        }
        return {
            width: w,
            depth: d,
            height: item.customHeight ?? 0.3,
            color: '#6366f1',
            shape: 'box'
        };
    }
    const isPerson = item.type === 'person';
    const isMonitor = item.type === 'monitor';
    const isPower = item.type === 'power';
    const isStand = item.type === 'stand';
    const label = (item.label || '').toLowerCase();
    // Specific Item Detection based on labels generated in StepStagePlot
    if (isPerson) {
        return {
            width: 0.5,
            depth: 0.5,
            height: 1.7,
            color: COLORS.person,
            shape: 'person'
        };
    }
    if (isMonitor) {
        return {
            width: 0.6,
            depth: 0.4,
            height: 0.3,
            color: COLORS.monitor,
            shape: 'wedge'
        };
    }
    if (isPower) {
        return {
            width: 0.3,
            depth: 0.3,
            height: 0.3,
            color: COLORS.power,
            shape: 'box'
        };
    }
    if (isStand) {
        return {
            width: 0.2,
            depth: 0.2,
            height: 1.5,
            color: COLORS.stand,
            shape: 'pole'
        };
    }
    // Instrument / Gear detection
    if (label.includes('amp')) {
        return {
            width: 0.7,
            depth: 0.4,
            height: 0.7,
            color: COLORS.amp,
            shape: 'box'
        };
    }
    if (label.includes('kit') || label.includes('drum')) {
        return {
            width: 1.8,
            depth: 1.5,
            height: 0.9,
            color: COLORS.drum,
            shape: 'box'
        };
    }
    if (label.includes('keys')) {
        return {
            width: 1.2,
            depth: 0.4,
            height: 0.9,
            color: COLORS.keys,
            shape: 'box'
        };
    }
    if (label.includes('di')) {
        return {
            width: 0.2,
            depth: 0.2,
            height: 0.1,
            color: COLORS.di,
            shape: 'box'
        };
    }
    if (label.includes('pedal') || label.includes('modeller')) {
        return {
            width: 0.6,
            depth: 0.3,
            height: 0.1,
            color: COLORS.pedalboard,
            shape: 'box'
        };
    }
    if (label.includes('mic')) {
        return {
            width: 0.2,
            depth: 0.2,
            height: 1.5,
            color: COLORS.mic,
            shape: 'pole'
        };
    }
    if (label.includes('gtr') || label.includes('guitar') || label.includes('bass') || label.includes('sax') || label.includes('tpt') || label.includes('brass')) {
        // Instrument on stand
        return {
            width: 0.4,
            depth: 0.3,
            height: 1.0,
            color: COLORS.instrument,
            shape: 'instrument'
        };
    }
    // Fallback
    return {
        width: 0.3,
        depth: 0.3,
        height: 0.3,
        color: '#cbd5e1',
        shape: 'box'
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/stageHelpers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateMemberItems",
    ()=>generateMemberItems,
    "getAmpCount",
    ()=>getAmpCount,
    "getDiInputCount",
    ()=>getDiInputCount,
    "getDiLabel",
    ()=>getDiLabel,
    "getPersonPose",
    ()=>getPersonPose,
    "percentToX",
    ()=>percentToX,
    "percentToZ",
    ()=>percentToZ,
    "shouldCreateModeller",
    ()=>shouldCreateModeller,
    "xToPercent",
    ()=>xToPercent,
    "zToPercent",
    ()=>zToPercent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants.ts [app-client] (ecmascript)");
;
;
;
const getAmpCount = (instId)=>{
    // gtr_amp_2 has 2 amps, all others with 'amp' have 1
    return instId === 'gtr_amp_2' ? 2 : 1;
};
const getDiInputCount = (instId)=>{
    if (instId === 'dj') return 2; // DJ L + DJ R
    if (instId === 'keys_stereo') return 2; // Keys L + Keys R
    if (instId === 'tracks_stereo') return 2; // Tracks L + Tracks R
    if (instId === 'gtr_modeler_stereo') return 2; // Modeller L + Modeller R
    if (instId === 'bass_combined') return 2; // Bass DI + Bass Amp (though amp is mic)
    return 1; // Everything else with DI is mono
};
const getDiLabel = (instId)=>{
    const count = getDiInputCount(instId);
    return count > 1 ? `DI (${count})` : 'DI';
};
const shouldCreateModeller = (instId)=>{
    return instId.includes('modeler');
};
const percentToX = (p)=>p / 100 * __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] - __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2;
const percentToZ = (p)=>p / 100 * __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] - __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2;
const xToPercent = (w)=>(w + __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2) / __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] * 100;
const zToPercent = (w)=>(w + __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2) / __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] * 100;
const generateMemberItems = (member, startX, startY, idBaseOverride)=>{
    const items = [];
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
    member.instruments.forEach((slot, idx)=>{
        const instId = slot.instrumentId;
        const inst = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find((i)=>i.id === instId);
        if (!inst) return;
        // Offsets to spread items around the person
        const isRight = idx % 2 === 0;
        const spreadX = isRight ? 8 : -8;
        // Note: Drums, Keys (main body), and Vocals are now part of the Person model, 
        // so we do not generate separate stage items for them.
        // KEYS - Only add peripherals like DI
        if (inst.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].KEYS) {
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
        } else if (instId.includes('amp') || instId.includes('combined')) {
            const numAmps = getAmpCount(instId);
            for(let ampIdx = 0; ampIdx < numAmps; ampIdx++){
                const ampX = startX + (ampCount % 2 === 0 ? -12 : 12);
                items.push({
                    id: `amp-${baseId}-${idx}-${ampIdx}`,
                    memberId: member.id,
                    type: 'member',
                    label: 'Amp',
                    x: ampX,
                    y: startY - 10,
                    fromInstrumentIndex: idx,
                    isPeripheral: true
                });
                ampCount++;
            }
        }
        // INSTRUMENTS ON STANDS OR HELD (Guitar/Bass/Brass)
        if ([
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].GUITAR,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BASS,
            __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BRASS
        ].includes(inst.type)) {
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
                    label: inst.group,
                    x: startX + spreadX,
                    y: startY - 5,
                    fromInstrumentIndex: idx,
                    isPeripheral: false
                });
            }
            // Pedalboard / Modeller (Peripheral)
            if (shouldCreateModeller(instId)) {
                items.push({
                    id: `mod-${baseId}-${idx}`,
                    memberId: member.id,
                    type: 'member',
                    label: 'Modeller',
                    x: startX + spreadX,
                    y: startY + 8,
                    fromInstrumentIndex: idx,
                    isPeripheral: true
                });
            } else if (inst.type !== __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BRASS && inst.id !== 'gtr_ac') {
                items.push({
                    id: `pedal-${baseId}-${idx}`,
                    memberId: member.id,
                    type: 'member',
                    label: 'Pedals',
                    x: startX + spreadX,
                    y: startY + 8,
                    fromInstrumentIndex: idx,
                    isPeripheral: true
                });
            }
            // DI Box (Peripheral)
            if (inst.defaultDi || instId.includes('di')) {
                const diLabel = getDiLabel(instId);
                items.push({
                    id: `di-${baseId}-${idx}`,
                    memberId: member.id,
                    type: 'member',
                    label: diLabel,
                    x: startX + spreadX + (isRight ? 2 : -2),
                    y: startY + 5,
                    fromInstrumentIndex: idx,
                    isPeripheral: true
                });
            }
        }
    });
    return items;
};
const getPersonPose = (member)=>{
    let pose = 'stand';
    let heldInstrumentId;
    // 1. Roles (Drums, Keys, DJ, Vocals)
    const hasDrums = member.instruments.some((slot)=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find((i)=>i.id === slot.instrumentId)?.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].DRUMS);
    const hasKeys = member.instruments.some((slot)=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find((i)=>i.id === slot.instrumentId)?.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].KEYS);
    const hasDj = member.instruments.some((slot)=>slot.instrumentId === 'dj');
    const hasVocal = member.instruments.some((slot)=>__TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find((i)=>i.id === slot.instrumentId)?.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].VOCAL);
    if (hasDrums) {
        pose = 'drums';
    } else if (hasDj) {
        pose = 'dj';
    } else if (hasKeys) {
        pose = 'keys';
    } else {
        // 2. Held Instruments (Guitar, Bass, Brass)
        const heldSlot = member.instruments.find((slot)=>{
            const inst = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find((i)=>i.id === slot.instrumentId);
            return inst && [
                __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].GUITAR,
                __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BASS,
                __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BRASS
            ].includes(inst.type);
        });
        heldInstrumentId = heldSlot?.instrumentId;
        if (heldInstrumentId) {
            const inst = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find((i)=>i.id === heldInstrumentId);
            const labelLower = (inst?.group || '').toLowerCase();
            if (inst?.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BASS) pose = 'bass';
            else if (inst?.id === 'gtr_ac' || labelLower.includes('acoustic')) pose = 'acoustic';
            else if (inst?.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].GUITAR) pose = 'guitar';
            else if (labelLower.includes('trumpet') || labelLower.includes('tpt')) pose = 'trumpet';
            else if (labelLower.includes('sax')) pose = 'sax';
        } else if (hasVocal) {
            pose = 'singing';
        }
    }
    return {
        pose,
        heldInstrumentId
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/3d/StageModels.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AcousticGuitarModel",
    ()=>AcousticGuitarModel,
    "AmpModel",
    ()=>AmpModel,
    "BassModel",
    ()=>BassModel,
    "DrumsModel",
    ()=>DrumsModel,
    "ElectricGuitarModel",
    ()=>ElectricGuitarModel,
    "MODEL_OFFSETS",
    ()=>MODEL_OFFSETS,
    "MicStandModel",
    ()=>MicStandModel,
    "PersonModel",
    ()=>PersonModel,
    "SaxModel",
    ()=>SaxModel,
    "StandModel",
    ()=>StandModel,
    "SynthModel",
    ()=>SynthModel,
    "TrumpetModel",
    ()=>TrumpetModel,
    "useStageModel",
    ()=>useStageModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Gltf.js [app-client] (ecmascript)");
// @ts-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$SkeletonUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/utils/SkeletonUtils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature();
;
;
;
const BASE_URL = '/assets/';
const URLS = {
    GUITAR_ELEC: BASE_URL + 'Electric_Guitar_Telecaster_Blue.glb',
    GUITAR_ACOUSTIC: BASE_URL + 'Acoustic_Guitar_Beige.glb',
    BASS: BASE_URL + 'Bass_Guitar_Firebird_Red.glb',
    AMPLIFIER: BASE_URL + 'Amplifier.glb',
    DRUMS: BASE_URL + 'Drums_A.glb',
    PERSON: BASE_URL + 'Male_Strong.glb',
    // Baked Animation Models
    MALE_ACOUSTIC: BASE_URL + 'Male_Ac_Guitar_Playing.glb',
    MALE_BASS: BASE_URL + 'Male_Bass_Playing.glb',
    MALE_DRUMS: BASE_URL + 'Male_Drumming.glb',
    MALE_GUITAR: BASE_URL + 'Male_Guitar_Playing.glb',
    MALE_KEYS: BASE_URL + 'Male_Keys_Playing.glb',
    MALE_TRUMPET: BASE_URL + 'Male_Trumpet_Playing.glb',
    MALE_SAX: BASE_URL + 'Male_Sax_Playing.glb',
    MALE_SINGING: BASE_URL + 'Male_Singing.glb',
    MALE_DJ: BASE_URL + 'Male_DJ.glb',
    MIC_STAND: BASE_URL + 'Microfon_Stand_B.glb',
    SAX: BASE_URL + 'Saxophone.glb',
    TRUMPET: BASE_URL + 'Trumpet.glb',
    STAND: BASE_URL + 'Stand.glb',
    SYNTH: BASE_URL + 'Synth.glb'
};
// Preload models
Object.values(URLS).forEach((url)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"].preload(url));
const MODEL_OFFSETS = {
    DRUMS: [
        0,
        0,
        0
    ],
    SAX: [
        0,
        0,
        0
    ],
    TRUMPET: [
        0,
        0,
        0
    ],
    SYNTH: [
        0,
        0,
        0
    ],
    DEFAULT: [
        0,
        0,
        0
    ]
};
const useStageModel = (url, color)=>{
    _s();
    const { scene } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"])(url);
    const model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useStageModel.useMemo[model]": ()=>{
            const cloned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$SkeletonUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(scene);
            cloned.traverse({
                "useStageModel.useMemo[model]": (node)=>{
                    if (node.isMesh) {
                        const mesh = node;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        if (color && mesh.material) {
                            const materials = Array.isArray(mesh.material) ? mesh.material : [
                                mesh.material
                            ];
                            const newMaterials = materials.map({
                                "useStageModel.useMemo[model].newMaterials": (m)=>{
                                    const nm = m.clone();
                                    nm.color.set(color);
                                    nm.metalness = 0.1;
                                    nm.roughness = 0.6;
                                    return nm;
                                }
                            }["useStageModel.useMemo[model].newMaterials"]);
                            mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0];
                        }
                    }
                }
            }["useStageModel.useMemo[model]"]);
            return cloned;
        }
    }["useStageModel.useMemo[model]"], [
        scene,
        color
    ]);
    return model;
};
_s(useStageModel, "DEfcpHA4fBev/YTbRzcuz/WzfuY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"]
    ];
});
const ElectricGuitarModel = ({ color })=>{
    _s1();
    const model = useStageModel(URLS.GUITAR_ELEC, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        rotation: [
            0,
            Math.PI / 2,
            0
        ],
        position: MODEL_OFFSETS.DEFAULT
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 83,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ElectricGuitarModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c = ElectricGuitarModel;
const AcousticGuitarModel = ({ color })=>{
    _s2();
    const model = useStageModel(URLS.GUITAR_ACOUSTIC, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        rotation: [
            0,
            Math.PI / 2,
            0
        ],
        position: MODEL_OFFSETS.DEFAULT
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 88,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s2(AcousticGuitarModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c1 = AcousticGuitarModel;
const BassModel = ({ color })=>{
    _s3();
    const model = useStageModel(URLS.BASS, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        rotation: [
            0,
            0,
            0
        ],
        position: MODEL_OFFSETS.DEFAULT
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 93,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s3(BassModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c2 = BassModel;
const AmpModel = ({ color })=>{
    _s4();
    const model = useStageModel(URLS.AMPLIFIER, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        position: MODEL_OFFSETS.DEFAULT
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 98,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s4(AmpModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c3 = AmpModel;
const DrumsModel = ({ color })=>{
    _s5();
    const model = useStageModel(URLS.DRUMS, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        position: MODEL_OFFSETS.DRUMS,
        rotation: [
            0,
            0,
            0
        ]
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 103,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s5(DrumsModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c4 = DrumsModel;
const SynthModel = ({ color })=>{
    _s6();
    const model = useStageModel(URLS.SYNTH, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        position: MODEL_OFFSETS.SYNTH,
        rotation: [
            0,
            Math.PI,
            0
        ]
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 108,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s6(SynthModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c5 = SynthModel;
const MicStandModel = ({ color })=>{
    _s7();
    const model = useStageModel(URLS.MIC_STAND, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        position: MODEL_OFFSETS.DEFAULT,
        rotation: [
            0,
            Math.PI,
            0
        ]
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 113,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s7(MicStandModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c6 = MicStandModel;
const SaxModel = ({ color })=>{
    _s8();
    const model = useStageModel(URLS.SAX, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        position: MODEL_OFFSETS.SAX
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 118,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s8(SaxModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c7 = SaxModel;
const TrumpetModel = ({ color })=>{
    _s9();
    const model = useStageModel(URLS.TRUMPET, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        position: MODEL_OFFSETS.TRUMPET
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 123,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s9(TrumpetModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c8 = TrumpetModel;
const StandModel = ({ color })=>{
    _s10();
    const model = useStageModel(URLS.STAND, color);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
        object: model,
        scale: 1,
        position: MODEL_OFFSETS.DEFAULT
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 128,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s10(StandModel, "hA5UOdm56paKSu1qeclzTB9oPtA=", false, function() {
    return [
        useStageModel
    ];
});
_c9 = StandModel;
const PersonModel = ({ color, pose = 'stand' })=>{
    _s11();
    // Load the appropriate baked animation model based on pose
    let url = URLS.PERSON;
    if (pose === 'acoustic') url = URLS.MALE_ACOUSTIC;
    else if (pose === 'bass') url = URLS.MALE_BASS;
    else if (pose === 'guitar') url = URLS.MALE_GUITAR;
    else if (pose === 'drums') url = URLS.MALE_DRUMS;
    else if (pose === 'keys') url = URLS.MALE_KEYS;
    else if (pose === 'trumpet') url = URLS.MALE_TRUMPET;
    else if (pose === 'sax') url = URLS.MALE_SAX;
    else if (pose === 'singing') url = URLS.MALE_SINGING;
    else if (pose === 'dj') url = URLS.MALE_DJ;
    const { scene } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"])(url);
    const personModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PersonModel.useMemo[personModel]": ()=>{
            const cloned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$utils$2f$SkeletonUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(scene);
            cloned.traverse({
                "PersonModel.useMemo[personModel]": (node)=>{
                    if (node.isMesh) {
                        const mesh = node;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        if (color && mesh.material) {
                            const materials = Array.isArray(mesh.material) ? mesh.material : [
                                mesh.material
                            ];
                            const newMaterials = materials.map({
                                "PersonModel.useMemo[personModel].newMaterials": (m)=>{
                                    const nm = m.clone();
                                    nm.color.set(color);
                                    nm.metalness = 0.1;
                                    nm.roughness = 0.6;
                                    return nm;
                                }
                            }["PersonModel.useMemo[personModel].newMaterials"]);
                            mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0];
                        }
                    }
                }
            }["PersonModel.useMemo[personModel]"]);
            return cloned;
        }
    }["PersonModel.useMemo[personModel]"], [
        scene,
        color
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("primitive", {
            object: personModel,
            scale: 1,
            position: MODEL_OFFSETS.DEFAULT
        }, void 0, false, {
            fileName: "[project]/components/3d/StageModels.tsx",
            lineNumber: 173,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/3d/StageModels.tsx",
        lineNumber: 172,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s11(PersonModel, "kyp3aHuDCZ05Ds3jsA/EpSV+lGw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Gltf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGLTF"]
    ];
});
_c10 = PersonModel;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "ElectricGuitarModel");
__turbopack_context__.k.register(_c1, "AcousticGuitarModel");
__turbopack_context__.k.register(_c2, "BassModel");
__turbopack_context__.k.register(_c3, "AmpModel");
__turbopack_context__.k.register(_c4, "DrumsModel");
__turbopack_context__.k.register(_c5, "SynthModel");
__turbopack_context__.k.register(_c6, "MicStandModel");
__turbopack_context__.k.register(_c7, "SaxModel");
__turbopack_context__.k.register(_c8, "TrumpetModel");
__turbopack_context__.k.register(_c9, "StandModel");
__turbopack_context__.k.register(_c10, "PersonModel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/3d/StageDraggableItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StageDraggableItem",
    ()=>StageDraggableItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/web/Html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageHelpers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/3d/StageModels.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
const StageDraggableItem = ({ item, activeId, onDown, onMove, onUp, isGhost = false, member, isRotating = false, showRotationUI = false, onRequestRotationUI, onCloseRotationUI, onRotate, onDelete, onQuantityChange, onMonitorNumberChange, onLabelChange, onHeightChange, onLabelHeightChange, onResizeStart, isEditable = false, viewMode = 'isometric', isPreview = false })=>{
    _s();
    const { width, height, depth, color, shape } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getItemConfig"])(item);
    const x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["percentToX"])(item.x);
    const z = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["percentToZ"])(item.y);
    const isDragging = activeId === item.id;
    const activeColor = '#fbbf24';
    const opacity = isGhost ? 0.6 : 1;
    const transparent = isGhost;
    const materialProps = {
        opacity,
        transparent,
        roughness: 0.4
    };
    // Track pointer position to detect clicks vs drags
    const downPosRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const threshold = 1; // pixels - if movement > this, it's a drag
    // Get THREE.js camera for bounding box calculations
    const { camera } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    // Calculate object's screen-space bounding box
    const getObjectScreenBounds = ()=>{
        const corners = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x - width / 2, 0, z - depth / 2),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x + width / 2, 0, z - depth / 2),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x - width / 2, height, z - depth / 2),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x + width / 2, height, z - depth / 2),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x - width / 2, 0, z + depth / 2),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x + width / 2, 0, z + depth / 2),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x - width / 2, height, z + depth / 2),
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x + width / 2, height, z + depth / 2)
        ];
        const screenCorners = corners.map((corner)=>{
            corner.project(camera);
            return {
                x: (corner.x + 1) / 2 * window.innerWidth,
                y: (1 - corner.y) / 2 * window.innerHeight
            };
        });
        return {
            minX: Math.min(...screenCorners.map((c)=>c.x)),
            maxX: Math.max(...screenCorners.map((c)=>c.x)),
            minY: Math.min(...screenCorners.map((c)=>c.y)),
            maxY: Math.max(...screenCorners.map((c)=>c.y))
        };
    };
    // Context menu positioning
    const contextMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [contextMenuOffset, setContextMenuOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        y: 0,
        z: 0
    });
    const fixedContextMenuPosRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const prevShowRotationUIRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [menuReady, setMenuReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const showLabel = true;
    const labelLower = (item.label || '').toLowerCase();
    // Calculate scaled font size for preview vs interactive
    const baseFontSize = 10;
    const fontScale = isPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_LABEL_FONT_SCALE_PREVIEW"] : __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_LABEL_FONT_SCALE_INTERACTIVE"];
    const scaledFontSize = baseFontSize * fontScale;
    // --- Offset Logic for Visual Alignment ---
    let offset = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OFFSETS"].DEFAULT;
    if (shape !== 'person') {
        if (labelLower.includes('drum') || labelLower.includes('kit')) {
            offset = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OFFSETS"].DRUMS;
        } else if (labelLower.includes('sax')) {
            offset = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OFFSETS"].SAX;
        } else if (labelLower.includes('trumpet') || labelLower.includes('tpt')) {
            offset = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OFFSETS"].TRUMPET;
        }
    }
    const [offX, offY, offZ] = offset;
    let labelYPadding = 0.3;
    if (shape === 'person') {
        labelYPadding = 0.65;
    } else if (labelLower.includes('sax')) {
        labelYPadding = 0.05;
    }
    // Isometric: Y = -1.0 puts the menu below the stage floor, which projects below ALL objects on screen.
    // Top view: Z = depth/2 + 1.2 places the menu below the object's footprint on screen.
    const calculatedContextMenuPosY = viewMode === 'isometric' ? -1.0 : 0;
    const calculatedContextMenuPosZ = viewMode === 'top' ? offZ + depth / 2 + 1.2 : offZ;
    // When menu opens: render it invisible at the initial position, measure actual bounds, correct,
    // then reveal. This prevents any visible jump regardless of menu height.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StageDraggableItem.useEffect": ()=>{
            let timer = null;
            if (showRotationUI && !prevShowRotationUIRef.current) {
                setMenuReady(false);
                setContextMenuOffset({
                    y: 0,
                    z: 0
                });
                // Set initial world-space position (menu is invisible at this point)
                if (viewMode === 'top') {
                    fixedContextMenuPosRef.current = {
                        y: 0,
                        z: offZ + depth / 2 + 1.2
                    };
                } else {
                    fixedContextMenuPosRef.current = {
                        y: -1.0,
                        z: offZ
                    };
                }
                // After DOM renders (one frame is enough), measure actual position and correct if needed
                timer = setTimeout({
                    "StageDraggableItem.useEffect": ()=>{
                        const newOffset = {
                            y: 0,
                            z: 0
                        };
                        if (contextMenuRef.current) {
                            const menuRect = contextMenuRef.current.getBoundingClientRect();
                            const objectBounds = getObjectScreenBounds();
                            const margin = 24;
                            const padding = 12;
                            const overlapsObject = menuRect.left < objectBounds.maxX + margin && menuRect.right > objectBounds.minX - margin && menuRect.top < objectBounds.maxY + margin && menuRect.bottom > objectBounds.minY - margin;
                            const outBottom = menuRect.bottom > window.innerHeight - padding;
                            const outTop = menuRect.top < padding;
                            const outLeft = menuRect.left < padding;
                            const outRight = menuRect.right > window.innerWidth - padding;
                            if (overlapsObject || outBottom || outTop || outLeft || outRight) {
                                const wp0 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x, 0, z).project(camera);
                                const wpY = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x, 1, z).project(camera);
                                const screenPerWorldY = Math.abs((wpY.y - wp0.y) * (window.innerHeight / 2)) || 80;
                                const menuMidY = (menuRect.top + menuRect.bottom) / 2;
                                const spaceAbove = objectBounds.minY - padding;
                                const spaceBelow = window.innerHeight - objectBounds.maxY - padding;
                                if (overlapsObject || outBottom) {
                                    if (spaceAbove >= menuRect.height + margin) {
                                        const targetMidY = objectBounds.minY - margin - menuRect.height / 2;
                                        newOffset.y = -(targetMidY - menuMidY) / screenPerWorldY;
                                    } else if (spaceBelow >= menuRect.height + margin) {
                                        const targetMidY = objectBounds.maxY + margin + menuRect.height / 2;
                                        newOffset.y = -(targetMidY - menuMidY) / screenPerWorldY;
                                    } else {
                                        const spaceRight = window.innerWidth - objectBounds.maxX - padding;
                                        newOffset.z = spaceRight >= menuRect.width + margin ? -2.5 : 2.5;
                                    }
                                } else if (outTop) {
                                    const targetMidY = padding + menuRect.height / 2;
                                    newOffset.y = -(targetMidY - menuMidY) / screenPerWorldY;
                                }
                                if (outLeft) newOffset.z = 2.0;
                                else if (outRight) newOffset.z = -2.0;
                            }
                        }
                        setContextMenuOffset(newOffset);
                        setMenuReady(true);
                    // getObjectScreenBounds, x, z, camera etc. are captured by closure at open time
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    }
                }["StageDraggableItem.useEffect"], 50);
            }
            if (!showRotationUI && prevShowRotationUIRef.current) {
                fixedContextMenuPosRef.current = null;
                setMenuReady(false);
            }
            prevShowRotationUIRef.current = showRotationUI;
            return ({
                "StageDraggableItem.useEffect": ()=>{
                    if (timer) clearTimeout(timer);
                }
            })["StageDraggableItem.useEffect"];
        // offZ, depth, viewMode, x, z, camera captured by closure at open time
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["StageDraggableItem.useEffect"], [
        showRotationUI
    ]);
    // Use fixed position while menu is open, otherwise calculate current position
    const contextMenuPosY = fixedContextMenuPosRef.current?.y ?? calculatedContextMenuPosY;
    const contextMenuPosZ = fixedContextMenuPosRef.current?.z ?? calculatedContextMenuPosZ;
    // Hitbox dimensions - match actual model dimensions for better selection
    // In both views, we need width x depth coverage with small padding
    const hitboxPadding = 0.2;
    const hitboxWidth = Math.max(width, 0.6) + hitboxPadding;
    const hitboxDepth = Math.max(depth, 0.6) + hitboxPadding;
    const renderModel = ()=>{
        // --- PERSON ---
        if (shape === 'person') {
            const { pose } = member ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPersonPose"])(member) : {
                pose: 'stand'
            };
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PersonModel"], {
                color: isDragging ? activeColor : undefined,
                pose: pose
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 250,
                columnNumber: 16
            }, ("TURBOPACK compile-time value", void 0));
        }
        // --- MIC STAND ---
        if (item.type === 'stand') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MicStandModel"], {}, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 255,
                columnNumber: 16
            }, ("TURBOPACK compile-time value", void 0));
        }
        const modelColor = isDragging ? activeColor : color;
        // --- INSTRUMENTS & GEAR ---
        if (labelLower.includes('amp')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmpModel"], {
                color: modelColor
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 262,
                columnNumber: 16
            }, ("TURBOPACK compile-time value", void 0));
        }
        if (labelLower.includes('bass')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BassModel"], {
                color: modelColor
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 266,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        if (labelLower.includes('acoustic')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AcousticGuitarModel"], {
                color: modelColor
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 270,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        if (labelLower.includes('guitar')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ElectricGuitarModel"], {
                color: modelColor
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 274,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        if (labelLower.includes('sax')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaxModel"], {
                color: modelColor
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 278,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        if (labelLower.includes('trumpet') || labelLower.includes('tpt')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrumpetModel"], {
                color: modelColor
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 282,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        // --- CUSTOM LABEL-ONLY (invisible hitbox) ---
        if (item.type === 'custom' && !(item.customWidth ?? 0) && !(item.customDepth ?? 0)) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    0.005,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            0.3,
                            0.01,
                            0.3
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/3d/StageDraggableItem.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        transparent: true,
                        opacity: 0
                    }, void 0, false, {
                        fileName: "[project]/components/3d/StageDraggableItem.tsx",
                        lineNumber: 290,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 288,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
        // --- FALLBACK BOX/SHAPES ---
        if (shape === 'wedge') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                position: [
                    0,
                    height / 2,
                    0
                ],
                rotation: [
                    Math.PI / 6,
                    0,
                    0
                ],
                castShadow: !isGhost,
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            width,
                            height,
                            depth
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/3d/StageDraggableItem.tsx",
                        lineNumber: 299,
                        columnNumber: 18
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: modelColor,
                        ...materialProps
                    }, void 0, false, {
                        fileName: "[project]/components/3d/StageDraggableItem.tsx",
                        lineNumber: 300,
                        columnNumber: 18
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 298,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
            position: [
                0,
                height / 2,
                0
            ],
            castShadow: !isGhost,
            receiveShadow: true,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                    args: [
                        width,
                        height,
                        depth
                    ]
                }, void 0, false, {
                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                    lineNumber: 307,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: modelColor,
                    ...materialProps
                }, void 0, false, {
                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                    lineNumber: 308,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/3d/StageDraggableItem.tsx",
            lineNumber: 306,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            x,
            0,
            z
        ],
        children: [
            showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                position: [
                    0 + offX,
                    item.type === 'custom' && item.labelHeight ? item.labelHeight : height + labelYPadding + offY,
                    0 + offZ
                ],
                center: true,
                zIndexRange: isDragging ? [
                    500,
                    400
                ] : [
                    100,
                    0
                ],
                style: {
                    pointerEvents: isPreview ? 'none' : 'none'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `font-black whitespace-nowrap select-none tracking-tight px-1 rounded border text-center inline-block ${isGhost ? 'text-slate-700 bg-white/30 border-white/10' : 'text-slate-900 bg-white/50 border-white/20'}`,
                    style: {
                        fontSize: `${scaledFontSize}px`,
                        lineHeight: '1.2',
                        padding: '2px 4px',
                        minHeight: '16px',
                        display: 'inline-block',
                        verticalAlign: 'baseline'
                    },
                    children: item.type === 'power' && item.quantity ? `${item.label} (${item.quantity})` : item.type === 'monitor' && item.monitorNumber ? `${item.label} ${item.monitorNumber}` : item.label
                }, void 0, false, {
                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                    lineNumber: 322,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 316,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showRotationUI && !isGhost && isEditable && (onRotate || item.type === 'power' || item.type === 'monitor' || item.type === 'custom') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$web$2f$Html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Html"], {
                position: [
                    0 + offX,
                    contextMenuPosY + contextMenuOffset.y,
                    contextMenuPosZ + contextMenuOffset.z
                ],
                center: true,
                zIndexRange: [
                    1000,
                    900
                ],
                style: {
                    pointerEvents: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: contextMenuRef,
                    className: "flex gap-1 bg-slate-900 border border-slate-600 rounded-lg p-1.5 shadow-lg",
                    style: {
                        opacity: menuReady ? 1 : 0,
                        pointerEvents: menuReady ? undefined : 'none'
                    },
                    onClick: (e)=>e.stopPropagation(),
                    onPointerDown: (e)=>e.stopPropagation(),
                    onPointerUp: (e)=>e.stopPropagation(),
                    children: [
                        item.type === 'power' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        const newQty = Math.max(1, (item.quantity || 1) - 1);
                                        onQuantityChange?.(item.id, newQty);
                                    },
                                    className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors",
                                    title: "Decrease quantity",
                                    children: "−"
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 356,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-2 py-1 text-white text-xs font-bold flex items-center bg-slate-800 rounded",
                                    children: item.quantity || 1
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 366,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        onQuantityChange?.(item.id, (item.quantity || 1) + 1);
                                    },
                                    className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors",
                                    title: "Increase quantity",
                                    children: "+"
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 369,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true) : item.type === 'monitor' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                const newNum = Math.max(0, (item.monitorNumber || 0) - 1);
                                                onMonitorNumberChange?.(item.id, newNum);
                                            },
                                            className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors",
                                            title: "Decrease monitor number",
                                            children: "−"
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 382,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-2 py-1 text-white text-xs font-bold flex items-center bg-slate-800 rounded min-w-[32px] justify-center",
                                            children: item.monitorNumber || 0
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 392,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                onMonitorNumberChange?.(item.id, (item.monitorNumber || 0) + 1);
                                            },
                                            className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors",
                                            title: "Increase monitor number",
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 395,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 381,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onRotate?.(item.id, 'left'),
                                            className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex-1",
                                            title: "Rotate left 22.5°",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                lineNumber: 411,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 406,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                onCloseRotationUI?.();
                                            },
                                            className: "px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex-1",
                                            title: "Done rotating",
                                            children: "Done"
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 413,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onRotate?.(item.id, 'right'),
                                            className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex-1",
                                            title: "Rotate right 22.5°",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                lineNumber: 427,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 422,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 405,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                            lineNumber: 380,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : item.type === 'custom' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: item.label,
                                    onChange: (e)=>onLabelChange?.(item.id, e.target.value),
                                    className: "px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:border-indigo-500 w-full min-w-[120px]",
                                    placeholder: "Name...",
                                    autoFocus: true,
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter') onCloseRotationUI?.();
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 433,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                (item.customWidth ?? 0) === 0 && (item.customDepth ?? 0) === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slate-400 text-[10px] w-7",
                                            children: "Label"
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 444,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onLabelHeightChange?.(item.id, (item.labelHeight ?? 1.7) - 0.2),
                                            className: "p-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-[10px]",
                                            children: "−"
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 445,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-1 py-1 text-white text-[10px] font-bold flex items-center bg-slate-800 rounded min-w-[32px] justify-center",
                                            children: [
                                                (item.labelHeight ?? 1.7).toFixed(1),
                                                "m"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 449,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onLabelHeightChange?.(item.id, (item.labelHeight ?? 1.7) + 0.2),
                                            className: "p-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-[10px]",
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 452,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 443,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                (item.customWidth ?? 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400 text-[10px] w-8",
                                                    children: "W"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>onResizeStart?.(item.id),
                                                    className: "flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1",
                                                    title: "Move cursor to resize width/depth. Switch to Top View for best results. Click canvas to finish.",
                                                    children: "⇲ Drag"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 460,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-400 text-[10px] w-8",
                                                    children: "H"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                    lineNumber: 465,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>onHeightChange?.(item.id, (item.customHeight ?? 0.3) - 0.2),
                                                    className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors",
                                                    children: "−"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                    lineNumber: 466,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-1 py-1 text-white text-[10px] font-bold flex items-center bg-slate-800 rounded min-w-[32px] justify-center",
                                                    children: [
                                                        ((item.customHeight ?? 0.3) * 10).toFixed(0) === '0' ? '0.1' : (item.customHeight ?? 0.3).toFixed(1),
                                                        "m"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                    lineNumber: 470,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>onHeightChange?.(item.id, (item.customHeight ?? 0.3) + 0.2),
                                                    className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors",
                                                    children: "+"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                    lineNumber: 473,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 464,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onRotate?.(item.id, 'left'),
                                            className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex-1",
                                            title: "Rotate left 22.5°",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                lineNumber: 486,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 481,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onCloseRotationUI?.(),
                                            className: "px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex-1",
                                            title: "Done",
                                            children: "Done"
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 488,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onRotate?.(item.id, 'right'),
                                            className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors flex-1",
                                            title: "Rotate right 22.5°",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                                lineNumber: 500,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                            lineNumber: 495,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 480,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                            lineNumber: 432,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onRotate?.(item.id, 'left'),
                                    className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors",
                                    title: "Rotate left 22.5°",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                        lineNumber: 511,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 506,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        onCloseRotationUI?.();
                                    },
                                    className: "px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors",
                                    title: "Done rotating",
                                    children: "Done"
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 513,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onRotate?.(item.id, 'right'),
                                    className: "p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors",
                                    title: "Rotate right 22.5°",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                        lineNumber: 527,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 522,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-px bg-slate-600"
                        }, void 0, false, {
                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                            lineNumber: 531,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onDelete?.(item.id),
                            className: "p-1.5 bg-red-700 hover:bg-red-600 text-white rounded transition-colors",
                            title: "Delete",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                lineNumber: 537,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                            lineNumber: 532,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                    lineNumber: 346,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 340,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                rotation: [
                    0,
                    item.rotation || 0,
                    0
                ],
                onPointerDown: !isGhost ? (e)=>{
                    e.stopPropagation();
                    // Track pointer position for click detection
                    downPosRef.current = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    if (showRotationUI) {
                        // Click while rotation UI showing - close it
                        onCloseRotationUI?.();
                    } else {
                        // First click or switching items - initiate drag/selection
                        onDown(e, item.id);
                    }
                } : undefined,
                onPointerMove: !isGhost && !showRotationUI ? onMove : undefined,
                onPointerUp: !isGhost ? (e)=>{
                    e.stopPropagation();
                    // Check if this was a click (no significant drag) or actual drag
                    const wasDrag = downPosRef.current && (Math.abs(e.clientX - downPosRef.current.x) > threshold || Math.abs(e.clientY - downPosRef.current.y) > threshold);
                    downPosRef.current = null;
                    if (!showRotationUI) {
                        // Normal up handler for dragging
                        onUp(e);
                    }
                    // Show rotation UI in response to a click (not a drag) on already-selected item
                    if (!wasDrag && isEditable && activeId === item.id && !showRotationUI) {
                        onRequestRotationUI?.();
                    }
                } : undefined,
                children: [
                    (()=>{
                        const isLabelOnly = item.type === 'custom' && (item.customWidth ?? 0) === 0 && (item.customDepth ?? 0) === 0;
                        const hitboxY = isLabelOnly && item.labelHeight ? item.labelHeight : height / 2 + offY;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0 + offX,
                                hitboxY,
                                0 + offZ
                            ],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                    args: [
                                        hitboxWidth,
                                        isLabelOnly ? 0.4 : height,
                                        hitboxDepth
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 587,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                    transparent: true,
                                    opacity: 0
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 588,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                            lineNumber: 586,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0));
                    })(),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            position: [
                                0,
                                height / 2,
                                0
                            ],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                    args: [
                                        width,
                                        height,
                                        depth
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 595,
                                    columnNumber: 17
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                    color: color,
                                    opacity: 0.5,
                                    transparent: true
                                }, void 0, false, {
                                    fileName: "[project]/components/3d/StageDraggableItem.tsx",
                                    lineNumber: 596,
                                    columnNumber: 17
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/3d/StageDraggableItem.tsx",
                            lineNumber: 594,
                            columnNumber: 13
                        }, void 0),
                        children: renderModel()
                    }, void 0, false, {
                        fileName: "[project]/components/3d/StageDraggableItem.tsx",
                        lineNumber: 593,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/3d/StageDraggableItem.tsx",
                lineNumber: 543,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/3d/StageDraggableItem.tsx",
        lineNumber: 314,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StageDraggableItem, "8wIWOVxz4SKZTpc3f6PTlowHXNU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c = StageDraggableItem;
var _c;
__turbopack_context__.k.register(_c, "StageDraggableItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/StagePlotCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StagePlotCanvas",
    ()=>StagePlotCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrthographicCamera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrthographicCamera.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Grid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$ContactShadows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/ContactShadows.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageHelpers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageDraggableItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/3d/StageDraggableItem.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/3d/StageModels.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
// Component that captures canvas screenshot for preview mode
// Camera position/zoom is already set by ResponsiveCameraAdjuster — just capture what's rendered
const ScreenshotCapture = ({ isPreview, containerRef, onScreenshot })=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScreenshotCapture.useEffect": ()=>{
            if (!isPreview) return;
            // Wait for ResponsiveCameraAdjuster to apply zoom-to-fit and for Three.js to render
            const timer = setTimeout({
                "ScreenshotCapture.useEffect.timer": ()=>{
                    if (containerRef.current) {
                        // Add CSS fix before capturing
                        const style = document.createElement('style');
                        style.textContent = `
          img { display: inline-block !important; }
          div { line-height: 1 !important; }
          * { line-height: 1 !important; }
        `;
                        document.head.appendChild(style);
                        __turbopack_context__.A("[project]/node_modules/html2canvas/dist/html2canvas.js [app-client] (ecmascript, async loader)").then({
                            "ScreenshotCapture.useEffect.timer": (html2canvas)=>{
                                html2canvas.default(containerRef.current, {
                                    backgroundColor: '#f1f5f9',
                                    scale: 2,
                                    logging: false,
                                    useCORS: true,
                                    imageTimeout: 5000,
                                    allowTaint: true
                                }).then({
                                    "ScreenshotCapture.useEffect.timer": (canvas)=>{
                                        onScreenshot(canvas.toDataURL('image/png'));
                                        // Clean up the style
                                        document.head.removeChild(style);
                                    }
                                }["ScreenshotCapture.useEffect.timer"]);
                            }
                        }["ScreenshotCapture.useEffect.timer"]);
                    }
                }
            }["ScreenshotCapture.useEffect.timer"], 200);
            return ({
                "ScreenshotCapture.useEffect": ()=>clearTimeout(timer)
            })["ScreenshotCapture.useEffect"];
        }
    }["ScreenshotCapture.useEffect"], [
        isPreview,
        containerRef,
        onScreenshot
    ]);
    return null;
};
_s(ScreenshotCapture, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ScreenshotCapture;
// Component to handle responsive camera zoom and orientation
const ResponsiveCameraAdjuster = ({ isTopView, isPreview })=>{
    _s1();
    const { camera, size } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ResponsiveCameraAdjuster.useEffect": ()=>{
            if (!camera) return;
            const orthoCamera = camera;
            // Pick the right settings from constants
            const cfg = isTopView ? isPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMERA_TOP_PREVIEW"] : __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMERA_TOP_INTERACTIVE"] : isPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMERA_ISO_PREVIEW"] : __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CAMERA_ISO_INTERACTIVE"];
            // Set camera up vector FIRST (before lookAt)
            camera.up.set(...isTopView ? [
                0,
                0,
                -1
            ] : [
                0,
                1,
                0
            ]);
            camera.position.set(...cfg.position);
            camera.lookAt(...cfg.lookAt);
            camera.updateMatrix();
            camera.updateMatrixWorld();
            // Zoom-to-fit: project stage bounding box corners at zoom=1, then scale to fill viewport.
            // This works for any camera angle or canvas size without hardcoded magic numbers.
            orthoCamera.zoom = 1;
            camera.updateProjectionMatrix();
            const h = cfg.modelHeight;
            const corners = [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2, 0, -__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2, 0, -__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2, 0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2, 0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2, h, -__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2, h, -__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](-__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2, h, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2),
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2, h, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2)
            ];
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (const corner of corners){
                const ndc = corner.clone().project(camera);
                if (ndc.x < minX) minX = ndc.x;
                if (ndc.x > maxX) maxX = ndc.x;
                if (ndc.y < minY) minY = ndc.y;
                if (ndc.y > maxY) maxY = ndc.y;
            }
            // NDC range [-1,1] covers the full viewport. Zoom needed to fit the projected extent:
            const zoomX = 2 / ((maxX - minX) * (1 + cfg.padding));
            const zoomY = 2 / ((maxY - minY) * (1 + cfg.padding));
            orthoCamera.zoom = Math.min(zoomX, zoomY);
            camera.updateProjectionMatrix();
        }
    }["ResponsiveCameraAdjuster.useEffect"], [
        size,
        camera,
        isTopView,
        isPreview
    ]);
    return null;
};
_s1(ResponsiveCameraAdjuster, "doXc0X4Ns9Jm26E5S4kY3VI4H4c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c1 = ResponsiveCameraAdjuster;
const StagePlatform = ()=>{
    const thickness = 0.2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: [
            0,
            -thickness / 2,
            0
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
            receiveShadow: true,
            position: [
                0,
                0,
                0
            ],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                    args: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"],
                        thickness,
                        __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"]
                    ]
                }, void 0, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 133,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: "#e2e8f0",
                    roughness: 0.6
                }, void 0, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/StagePlotCanvas.tsx",
            lineNumber: 132,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/StagePlotCanvas.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c2 = StagePlatform;
// Component to handle External Drag Logic inside Canvas context
const ExternalDragHandler = ({ dragCoords, onUpdate })=>{
    _s2();
    const { camera, raycaster } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const plane = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plane"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0), 0);
    const mouse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"]();
    const intersectPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExternalDragHandler.useEffect": ()=>{
            // Convert Pixel Coords to NDC (-1 to +1)
            mouse.x = dragCoords.x / dragCoords.width * 2 - 1;
            mouse.y = -(dragCoords.y / dragCoords.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            // Raycast to the floor plane
            if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
                const pctX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xToPercent"])(intersectPoint.x);
                const pctY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zToPercent"])(intersectPoint.z);
                // Return raw 0-100 coords. 
                const clampedX = Math.max(0, Math.min(100, pctX));
                const clampedY = Math.max(0, Math.min(100, pctY));
                onUpdate(clampedX, clampedY);
            }
        }
    }["ExternalDragHandler.useEffect"], [
        dragCoords,
        camera,
        raycaster,
        onUpdate
    ]);
    return null;
};
_s2(ExternalDragHandler, "tMuaI+mfXXFQhzs4XGDhsmB+Ses=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"]
    ];
});
_c3 = ExternalDragHandler;
const StagePlotCanvas = ({ items, setItems, editable, viewMode = 'isometric', showAudienceLabel = true, isPreview = false, ghostItems = [], dragCoords, onDragPosChange, members, rotatingItemId, onRotateItem, onScreenshot: onScreenshotProp })=>{
    _s3();
    const [activeId, setActiveId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [rotationUiItemId, setRotationUiItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resizingItemId, setResizingItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const resizingItemIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [screenshotUrl, setScreenshotUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleScreenshot = (dataUrl)=>{
        setScreenshotUrl(dataUrl);
        onScreenshotProp?.(dataUrl);
    };
    const dragOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        z: 0
    });
    // Keep ref in sync so the DOM listener can read the current resizingItemId without stale closure
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StagePlotCanvas.useEffect": ()=>{
            resizingItemIdRef.current = resizingItemId;
        }
    }["StagePlotCanvas.useEffect"], [
        resizingItemId
    ]);
    // Stop resize on any native pointerdown in the canvas container (fires even when THREE.js
    // stopPropagation prevents the floor-plane mesh from receiving the event)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StagePlotCanvas.useEffect": ()=>{
            if (!resizingItemId) return;
            const container = containerRef.current;
            if (!container) return;
            const handlePointerDown = {
                "StagePlotCanvas.useEffect.handlePointerDown": ()=>{
                    const prev = resizingItemIdRef.current;
                    setResizingItemId(null);
                    if (prev) setRotationUiItemId(prev);
                }
            }["StagePlotCanvas.useEffect.handlePointerDown"];
            // Delay by one frame so the "Resize" button's own pointerdown doesn't immediately cancel
            const raf = requestAnimationFrame({
                "StagePlotCanvas.useEffect.raf": ()=>{
                    container.addEventListener('pointerdown', handlePointerDown);
                }
            }["StagePlotCanvas.useEffect.raf"]);
            return ({
                "StagePlotCanvas.useEffect": ()=>{
                    cancelAnimationFrame(raf);
                    container.removeEventListener('pointerdown', handlePointerDown);
                }
            })["StagePlotCanvas.useEffect"];
        }
    }["StagePlotCanvas.useEffect"], [
        resizingItemId
    ]);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleDeleteItem = (id)=>{
        setItems(items.filter((i)=>i.id !== id));
        setRotationUiItemId(null);
    };
    const handleQuantityChange = (id, quantity)=>{
        setItems(items.map((i)=>i.id === id ? {
                ...i,
                quantity
            } : i));
    };
    const handleMonitorNumberChange = (id, monitorNumber)=>{
        setItems(items.map((i)=>i.id === id ? {
                ...i,
                monitorNumber
            } : i));
    };
    const handleLabelChange = (id, label)=>{
        setItems(items.map((i)=>i.id === id ? {
                ...i,
                label
            } : i));
    };
    const handleResizeStart = (id)=>{
        setResizingItemId(id);
        setRotationUiItemId(null);
    };
    const handleHeightChange = (id, height)=>{
        setItems(items.map((i)=>i.id === id ? {
                ...i,
                customHeight: Math.max(0.1, height)
            } : i));
    };
    const handleLabelHeightChange = (id, height)=>{
        setItems(items.map((i)=>i.id === id ? {
                ...i,
                labelHeight: Math.max(0.1, height)
            } : i));
    };
    const handlePointerDown = (e, id)=>{
        if (!editable) return;
        // While in resize mode, don't start a drag — the DOM listener handles stopping resize
        if (resizingItemId) return;
        e.stopPropagation();
        const plane = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plane"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0), 0);
        const pointOnPlane = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        e.ray.intersectPlane(plane, pointOnPlane);
        const item = items.find((i)=>i.id === id);
        if (item) {
            const currentX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["percentToX"])(item.x);
            const currentZ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["percentToZ"])(item.y);
            dragOffset.current = {
                x: currentX - pointOnPlane.x,
                z: currentZ - pointOnPlane.z
            };
        }
        setActiveId(id);
    };
    const handlePointerUp = (e)=>{
        if (!editable) return;
        setActiveId(null);
        dragOffset.current = {
            x: 0,
            z: 0
        };
    };
    const handlePlaneMove = (e)=>{
        if (!editable) return;
        if (resizingItemId) {
            const plane = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plane"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0), 0);
            const pointOnPlane = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
            e.ray.intersectPlane(plane, pointOnPlane);
            const item = items.find((i)=>i.id === resizingItemId);
            if (item) {
                const itemWorldX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["percentToX"])(item.x);
                const itemWorldZ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["percentToZ"])(item.y);
                const newWidth = Math.max(0.3, Math.abs(pointOnPlane.x - itemWorldX) * 2);
                const newDepth = Math.max(0.3, Math.abs(pointOnPlane.z - itemWorldZ) * 2);
                setItems(items.map((i)=>i.id === resizingItemId ? {
                        ...i,
                        customWidth: newWidth,
                        customDepth: newDepth
                    } : i));
            }
            return;
        }
        if (!activeId) return;
        e.stopPropagation();
        const plane = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Plane"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0), 0);
        const pointOnPlane = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]();
        e.ray.intersectPlane(plane, pointOnPlane);
        const targetWorldX = pointOnPlane.x + dragOffset.current.x;
        const targetWorldZ = pointOnPlane.z + dragOffset.current.z;
        // Get item dimensions to enforce boundaries
        const item = items.find((i)=>i.id === activeId);
        if (item) {
            const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getItemConfig"])(item);
            const halfWidth = config.width / 2;
            const halfDepth = config.depth / 2;
            // Determine visual offset (must match StageDraggableItem logic)
            let offset = [
                0,
                0,
                0
            ];
            const labelLower = (item.label || '').toLowerCase();
            if (config.shape !== 'person') {
                if (labelLower.includes('drum') || labelLower.includes('kit')) {
                    offset = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OFFSETS"].DRUMS;
                } else if (labelLower.includes('sax')) {
                    offset = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OFFSETS"].SAX;
                } else if (labelLower.includes('trumpet') || labelLower.includes('tpt')) {
                    offset = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MODEL_OFFSETS"].TRUMPET;
                }
            }
            const [offX, _offY, offZ] = offset;
            // Boundaries (World Coordinates)
            // We adjust bounds by the offset so the VISUAL mesh stays inside stage.
            // minX = Left Edge + Half Width - X Offset
            // maxX = Right Edge - Half Width - X Offset
            const minX = -(__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2) + halfWidth - offX;
            const maxX = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] / 2 - halfWidth - offX;
            const minZ = -(__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2) + halfDepth - offZ;
            const maxZ = __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2 - halfDepth - offZ;
            // Clamp
            const clampedWorldX = Math.max(minX, Math.min(maxX, targetWorldX));
            const clampedWorldZ = Math.max(minZ, Math.min(maxZ, targetWorldZ));
            const newX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xToPercent"])(clampedWorldX);
            const newY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zToPercent"])(clampedWorldZ);
            setItems(items.map((i)=>i.id === activeId ? {
                    ...i,
                    x: newX,
                    y: newY
                } : i));
        }
    };
    const isTopView = viewMode === 'top';
    const camPosition = isTopView ? [
        0,
        70,
        -1
    ] : [
        -20,
        30,
        20
    ];
    // Responsive font sizes for audience label
    const baseAudienceFontSize = 0.5; // Smaller for audience
    const audienceFontSize = baseAudienceFontSize * (isPreview ? __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUDIENCE_TEXT_FONT_SCALE_PREVIEW"] : __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUDIENCE_TEXT_FONT_SCALE_INTERACTIVE"]);
    // For preview with screenshot, show static image instead of threejs canvas
    if (isPreview && screenshotUrl) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full bg-slate-50 overflow-hidden border-2 border-slate-300 print:border-black shadow-inner relative select-none",
            style: {
                touchAction: 'none'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: screenshotUrl,
                alt: "Stage plot",
                className: "w-full h-full object-contain"
            }, void 0, false, {
                fileName: "[project]/components/StagePlotCanvas.tsx",
                lineNumber: 385,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/StagePlotCanvas.tsx",
            lineNumber: 381,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full h-full bg-slate-50 overflow-hidden border-2 border-slate-300 print:border-black shadow-inner relative select-none",
        style: {
            touchAction: 'none',
            cursor: resizingItemId ? 'crosshair' : undefined
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
            shadows: true,
            gl: {
                preserveDrawingBuffer: true,
                antialias: true
            },
            className: "w-full h-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrthographicCamera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrthographicCamera"], {
                    makeDefault: true,
                    position: camPosition,
                    zoom: 1,
                    near: -50,
                    far: 200
                }, viewMode, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 401,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResponsiveCameraAdjuster, {
                    isTopView: isTopView,
                    isPreview: isPreview
                }, void 0, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                    intensity: .9
                }, void 0, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 412,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                    position: [
                        -10,
                        30,
                        20
                    ],
                    intensity: 1,
                    castShadow: true,
                    "shadow-mapSize": [
                        2048,
                        2048
                    ],
                    "shadow-bias": 0.01
                }, void 0, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 413,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                    position: [
                        10,
                        10,
                        -10
                    ],
                    intensity: 0.4
                }, void 0, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 420,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                    position: [
                        0,
                        0,
                        0
                    ],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StagePlatform, {}, void 0, false, {
                            fileName: "[project]/components/StagePlotCanvas.tsx",
                            lineNumber: 423,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"], {
                            position: [
                                0,
                                0.01,
                                0
                            ],
                            args: [
                                __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"],
                                __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"]
                            ],
                            cellSize: 1,
                            cellThickness: 0.6,
                            cellColor: "#cbd5e1",
                            sectionSize: 2,
                            sectionThickness: 1,
                            sectionColor: "#94a3b8",
                            infiniteGrid: false
                        }, void 0, false, {
                            fileName: "[project]/components/StagePlotCanvas.tsx",
                            lineNumber: 424,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        showAudienceLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                            position: [
                                0,
                                0.05,
                                __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] / 2 + 0.3
                            ],
                            rotation: [
                                -Math.PI / 2,
                                0,
                                0
                            ],
                            fontSize: audienceFontSize,
                            color: "#64748b",
                            anchorX: "center",
                            anchorY: "middle",
                            children: "AUDIENCE"
                        }, void 0, false, {
                            fileName: "[project]/components/StagePlotCanvas.tsx",
                            lineNumber: 437,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                            rotation: [
                                -Math.PI / 2,
                                0,
                                0
                            ],
                            position: [
                                0,
                                0,
                                0
                            ],
                            onPointerDown: ()=>{
                                if (resizingItemId !== null) {
                                    const prev = resizingItemId;
                                    setResizingItemId(null);
                                    setRotationUiItemId(prev);
                                    return;
                                }
                                setRotationUiItemId(null);
                            },
                            onPointerMove: handlePlaneMove,
                            onPointerUp: handlePointerUp,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                                    args: [
                                        __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] * 3,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] * 3
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/components/StagePlotCanvas.tsx",
                                    lineNumber: 464,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                                    visible: false
                                }, void 0, false, {
                                    fileName: "[project]/components/StagePlotCanvas.tsx",
                                    lineNumber: 465,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StagePlotCanvas.tsx",
                            lineNumber: 449,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$ContactShadows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContactShadows"], {
                            position: [
                                0,
                                0.02,
                                0
                            ],
                            opacity: 0.2,
                            scale: 20,
                            blur: 10,
                            far: 2,
                            color: "#000000"
                        }, void 0, false, {
                            fileName: "[project]/components/StagePlotCanvas.tsx",
                            lineNumber: 468,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 422,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                    fallback: null,
                    children: [
                        items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageDraggableItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StageDraggableItem"], {
                                item: item,
                                activeId: activeId,
                                onDown: handlePointerDown,
                                onMove: handlePlaneMove,
                                onUp: handlePointerUp,
                                member: members?.find((m)=>m.id === item.memberId),
                                isRotating: rotatingItemId === item.id,
                                showRotationUI: rotationUiItemId === item.id,
                                onRequestRotationUI: ()=>setRotationUiItemId(item.id),
                                onCloseRotationUI: ()=>setRotationUiItemId(null),
                                onRotate: onRotateItem,
                                onDelete: handleDeleteItem,
                                onQuantityChange: handleQuantityChange,
                                onMonitorNumberChange: handleMonitorNumberChange,
                                onLabelChange: handleLabelChange,
                                onHeightChange: handleHeightChange,
                                onLabelHeightChange: handleLabelHeightChange,
                                onResizeStart: handleResizeStart,
                                isEditable: editable,
                                viewMode: viewMode,
                                isPreview: isPreview
                            }, item.id, false, {
                                fileName: "[project]/components/StagePlotCanvas.tsx",
                                lineNumber: 473,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))),
                        ghostItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageDraggableItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StageDraggableItem"], {
                                item: item,
                                activeId: null,
                                onDown: ()=>{},
                                onMove: ()=>{},
                                onUp: ()=>{},
                                isGhost: true,
                                member: members?.find((m)=>m.id === item.memberId),
                                isPreview: isPreview
                            }, item.id, false, {
                                fileName: "[project]/components/StagePlotCanvas.tsx",
                                lineNumber: 500,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 471,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                dragCoords && onDragPosChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExternalDragHandler, {
                    dragCoords: dragCoords,
                    onUpdate: onDragPosChange
                }, void 0, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 516,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                isPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreenshotCapture, {
                    isPreview: isPreview,
                    containerRef: containerRef,
                    onScreenshot: handleScreenshot
                }, void 0, false, {
                    fileName: "[project]/components/StagePlotCanvas.tsx",
                    lineNumber: 521,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/StagePlotCanvas.tsx",
            lineNumber: 400,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/StagePlotCanvas.tsx",
        lineNumber: 395,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s3(StagePlotCanvas, "+Ad/DnrWL/ADYct+lpgAH9IZSG0=");
_c4 = StagePlotCanvas;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ScreenshotCapture");
__turbopack_context__.k.register(_c1, "ResponsiveCameraAdjuster");
__turbopack_context__.k.register(_c2, "StagePlatform");
__turbopack_context__.k.register(_c3, "ExternalDragHandler");
__turbopack_context__.k.register(_c4, "StagePlotCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/StagePlotCanvas.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/StagePlotCanvas.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_4e4f2864._.js.map