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
"[project]/components/MemberPreview3D.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MemberPreview3D",
    ()=>MemberPreview3D
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$ContactShadows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/ContactShadows.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageHelpers.ts [app-client] (ecmascript)");
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
const PreviewItem = ({ position, args, color, type, pose })=>{
    const [width, height, depth] = args;
    const renderMesh = ()=>{
        if (type === 'person') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PersonModel"], {
            pose: pose
        }, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 40,
            columnNumber: 39
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'drums') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DrumsModel"], {}, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 41,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'amp') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmpModel"], {
            color: color
        }, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 42,
            columnNumber: 36
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'keys') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StandModel"], {
                        color: "#64748b"
                    }, void 0, false, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 47,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            0,
                            0.8,
                            0
                        ],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SynthModel"], {}, void 0, false, {
                            fileName: "[project]/components/MemberPreview3D.tsx",
                            lineNumber: 49,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 48,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/MemberPreview3D.tsx",
                lineNumber: 46,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        if (type === 'mic') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MicStandModel"], {
            color: color
        }, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 55,
            columnNumber: 36
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'modeller') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    0.05,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        castShadow: true,
                        receiveShadow: true,
                        position: [
                            0,
                            0,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.55,
                                    0.08,
                                    0.3
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 62,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#111827",
                                roughness: 0.5,
                                metalness: 0.4
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 63,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 61,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.041,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.5,
                                    0.002,
                                    0.25
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 67,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#374151",
                                roughness: 0.3,
                                metalness: 0.6
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 68,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 66,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            -0.15,
                            0.045,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.08,
                                    0.015,
                                    0.04
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 72,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#10b981",
                                roughness: 0.2,
                                metalness: 0.8
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 73,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 71,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.045,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.08,
                                    0.015,
                                    0.04
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 76,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#10b981",
                                roughness: 0.2,
                                metalness: 0.8
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 77,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 75,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.15,
                            0.045,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.08,
                                    0.015,
                                    0.04
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 80,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#10b981",
                                roughness: 0.2,
                                metalness: 0.8
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 81,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 79,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/MemberPreview3D.tsx",
                lineNumber: 59,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        if (type === 'di') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                position: [
                    0,
                    0.02,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        castShadow: true,
                        receiveShadow: true,
                        position: [
                            0,
                            0,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.25,
                                    0.08,
                                    0.15
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 92,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#ea580c",
                                roughness: 0.5,
                                metalness: 0.3
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 93,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 91,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0,
                            0.041,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.22,
                                    0.002,
                                    0.12
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 97,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#f97316",
                                roughness: 0.3,
                                metalness: 0.5
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 98,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 96,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/MemberPreview3D.tsx",
                lineNumber: 89,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        // Instruments (Standalone)
        if (type === 'guitar_elec') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ElectricGuitarModel"], {
            color: color
        }, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 105,
            columnNumber: 44
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'guitar_ac') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AcousticGuitarModel"], {
            color: color
        }, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 106,
            columnNumber: 42
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'bass') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BassModel"], {
            color: color
        }, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 107,
            columnNumber: 37
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'sax') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaxModel"], {
            color: color
        }, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 108,
            columnNumber: 36
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'trumpet') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrumpetModel"], {
            color: color
        }, void 0, false, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 109,
            columnNumber: 40
        }, ("TURBOPACK compile-time value", void 0));
        if (type === 'wedge') {
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
                castShadow: true,
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            width,
                            height,
                            depth
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 114,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: color,
                        roughness: 0.4
                    }, void 0, false, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 115,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/MemberPreview3D.tsx",
                lineNumber: 113,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
            castShadow: true,
            receiveShadow: true,
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
                    fileName: "[project]/components/MemberPreview3D.tsx",
                    lineNumber: 122,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                    color: color,
                    roughness: 0.4
                }, void 0, false, {
                    fileName: "[project]/components/MemberPreview3D.tsx",
                    lineNumber: 123,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 121,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        position: position,
        children: renderMesh()
    }, void 0, false, {
        fileName: "[project]/components/MemberPreview3D.tsx",
        lineNumber: 129,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = PreviewItem;
const MemberPreview3D = ({ member, isDragging = false, isSidebarPreview = false })=>{
    _s();
    const sceneItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MemberPreview3D.useMemo[sceneItems]": ()=>{
            const items = [];
            // --- DETERMINE POSE ---
            const { pose, heldInstrumentId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPersonPose"])(member);
            // 1. The Person
            items.push({
                id: 'person',
                pos: [
                    0,
                    0,
                    0
                ],
                size: [
                    0.5,
                    1.7,
                    0.5
                ],
                color: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLORS"].person,
                label: member.name || 'Musician',
                type: 'person',
                pose: pose
            });
            let ampCount = 0;
            let instrumentCount = 0;
            let diCount = 0;
            member.instruments.forEach({
                "MemberPreview3D.useMemo[sceneItems]": (slot)=>{
                    const instId = slot.instrumentId;
                    const inst = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find({
                        "MemberPreview3D.useMemo[sceneItems].inst": (i)=>i.id === instId
                    }["MemberPreview3D.useMemo[sceneItems].inst"]);
                    if (!inst) return;
                    // Note: DRUMS, KEYS, DJ, VOCALS are part of the person model or main scene setup,
                    // so we don't add separate items for them here unless they are peripherals.
                    // --- AMPS ---
                    if (instId.includes('amp') || instId.includes('combined')) {
                        const numAmps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAmpCount"])(instId);
                        for(let ampIdx = 0; ampIdx < numAmps; ampIdx++){
                            const offset = ampCount % 2 === 0 ? -0.9 : 0.9;
                            items.push({
                                id: `amp-${instId}-${ampCount}-${ampIdx}`,
                                pos: [
                                    offset,
                                    0,
                                    -0.6
                                ],
                                size: [
                                    0.7,
                                    0.7,
                                    0.4
                                ],
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLORS"].amp,
                                label: 'Amp',
                                type: 'amp'
                            });
                            ampCount++;
                        }
                    }
                    // --- DI BOXES ---
                    // Skip DJ (has XLR inputs instead)
                    if ((inst.defaultDi || instId.includes('di')) && instId !== 'dj') {
                        const diLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDiLabel"])(instId);
                        const diOffset = diCount % 2 === 0 ? -0.35 : 0.35;
                        items.push({
                            id: `di-${instId}-${diCount}`,
                            pos: [
                                diOffset,
                                0,
                                -1.2
                            ],
                            size: [
                                0.3,
                                0.1,
                                0.2
                            ],
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLORS"].di,
                            label: diLabel,
                            type: 'di'
                        });
                        diCount++;
                    }
                    // --- INSTRUMENTS (Standalone on stands) ---
                    // We only add these if they are NOT the instrument currently being held/played in the model
                    const isHeld = instId === heldInstrumentId;
                    const isBakedPose = [
                        'guitar',
                        'bass',
                        'acoustic',
                        'sax',
                        'trumpet'
                    ].includes(pose);
                    // Note: We skip the instrument BODY if held with baked pose,
                    // but we still add DI/Modeller/Pedals (those are always peripherals)
                    if (inst.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].GUITAR || inst.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BASS || inst.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BRASS) {
                        const isRight = instrumentCount % 2 === 0;
                        const sideOffset = isRight ? 0.6 : -0.6;
                        // Only add instrument body if it's NOT held with a baked pose
                        if (!isHeld || !isBakedPose) {
                            let type = 'box';
                            if (inst.id === 'gtr_ac') type = 'guitar_ac';
                            else if (inst.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BASS) type = 'bass';
                            else if (inst.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].GUITAR) type = 'guitar_elec';
                            else if (inst.id.includes('sax')) type = 'sax';
                            else if (inst.id.includes('tpt') || inst.id.includes('trumpet')) type = 'trumpet';
                            items.push({
                                id: `inst-body-${instId}`,
                                pos: [
                                    sideOffset,
                                    0,
                                    0.1
                                ],
                                size: [
                                    0.4,
                                    1.0,
                                    0.3
                                ],
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLORS"].instrument,
                                label: inst.type,
                                type: type
                            });
                        }
                        // Modeller and Pedals are always added (peripherals)
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shouldCreateModeller"])(instId)) {
                            items.push({
                                id: `modeller-${instId}`,
                                pos: [
                                    sideOffset,
                                    0,
                                    0.7
                                ],
                                size: [
                                    0.6,
                                    0.1,
                                    0.3
                                ],
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLORS"].pedalboard,
                                label: 'Modeller',
                                type: 'modeller'
                            });
                        } else if ((inst.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].GUITAR || inst.type === __TURBOPACK__imported__module__$5b$project$5d2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstrumentType"].BASS) && inst.id !== 'gtr_ac') {
                            items.push({
                                id: `pedal-${instId}`,
                                pos: [
                                    sideOffset,
                                    0,
                                    0.7
                                ],
                                size: [
                                    0.6,
                                    0.1,
                                    0.3
                                ],
                                color: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COLORS"].pedalboard,
                                label: 'Pedals',
                                type: 'box'
                            });
                        }
                        instrumentCount++;
                    }
                }
            }["MemberPreview3D.useMemo[sceneItems]"]);
            return items;
        }
    }["MemberPreview3D.useMemo[sceneItems]"], [
        member
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full bg-slate-900 rounded-lg overflow-hidden relative border border-slate-700 shadow-inner",
        style: {
            touchAction: isSidebarPreview ? 'auto' : 'none'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
            shadows: true,
            camera: {
                position: [
                    2.5,
                    2.5,
                    3.5
                ],
                fov: 35
            },
            style: {
                touchAction: isSidebarPreview ? 'auto' : 'none',
                pointerEvents: isSidebarPreview ? 'none' : 'auto'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                    intensity: 0.6
                }, void 0, false, {
                    fileName: "[project]/components/MemberPreview3D.tsx",
                    lineNumber: 265,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                    position: [
                        5,
                        8,
                        5
                    ],
                    intensity: 1.2,
                    castShadow: true,
                    "shadow-mapSize": [
                        512,
                        512
                    ]
                }, void 0, false, {
                    fileName: "[project]/components/MemberPreview3D.tsx",
                    lineNumber: 266,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                    position: [
                        -5,
                        2,
                        -5
                    ],
                    intensity: 0.5,
                    color: "#3b82f6"
                }, void 0, false, {
                    fileName: "[project]/components/MemberPreview3D.tsx",
                    lineNumber: 267,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                    fallback: null,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                        position: [
                            0,
                            -0.8,
                            0
                        ],
                        children: [
                            sceneItems.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PreviewItem, {
                                    position: item.pos,
                                    args: item.size,
                                    color: item.color,
                                    type: item.type,
                                    pose: item.pose
                                }, idx, false, {
                                    fileName: "[project]/components/MemberPreview3D.tsx",
                                    lineNumber: 272,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("gridHelper", {
                                args: [
                                    5,
                                    5,
                                    0x334155,
                                    0x1e293b
                                ],
                                position: [
                                    0,
                                    0.001,
                                    0
                                ]
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 281,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$ContactShadows$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ContactShadows"], {
                                position: [
                                    0,
                                    0,
                                    0
                                ],
                                opacity: 0.6,
                                scale: 10,
                                blur: 2,
                                far: 1.5
                            }, void 0, false, {
                                fileName: "[project]/components/MemberPreview3D.tsx",
                                lineNumber: 282,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/MemberPreview3D.tsx",
                        lineNumber: 270,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/MemberPreview3D.tsx",
                    lineNumber: 269,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"], {
                    enabled: !isSidebarPreview,
                    enableZoom: false,
                    autoRotate: !isDragging,
                    autoRotateSpeed: 1.5,
                    minPolarAngle: 0,
                    maxPolarAngle: Math.PI / 2.2
                }, void 0, false, {
                    fileName: "[project]/components/MemberPreview3D.tsx",
                    lineNumber: 286,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/MemberPreview3D.tsx",
            lineNumber: 264,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/MemberPreview3D.tsx",
        lineNumber: 260,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MemberPreview3D, "tyPWotTZZxPqbEEsp/13NOStzS4=");
_c1 = MemberPreview3D;
var _c, _c1;
__turbopack_context__.k.register(_c, "PreviewItem");
__turbopack_context__.k.register(_c1, "MemberPreview3D");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/StepInstruments.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepInstruments",
    ()=>StepInstruments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/music-2.js [app-client] (ecmascript) <export default as Music2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$inputUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/inputUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MemberPreview3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MemberPreview3D.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const StepInstruments = ({ data, addMember, applyRockTemplate, updateMemberName, updateMemberInstrument, removeMemberInstrument, addMemberInstrument, removeMember, updateInstrumentInputs })=>{
    _s();
    const [expandedInputs, setExpandedInputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Constants for mic options (common mics used in live sound)
    const MIC_SUGGESTIONS = [
        'SM57',
        'SM58',
        'Beta58',
        'Beta52A',
        'D112 MKII',
        'e604',
        'e609',
        'RE20',
        'Condenser',
        'Clip-on (XLR)',
        'DI'
    ];
    // Get unique groups for the dropdown
    const uniqueGroups = Array.from(new Set(__TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].map((i)=>i.group)));
    // Toggle expanded state for inputs
    const toggleInputsExpanded = (memberId, instrIndex)=>{
        const key = `${memberId}-${instrIndex}`;
        const newExpanded = new Set(expandedInputs);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedInputs(newExpanded);
    };
    // Get effective inputs (custom or defaults)
    const getEffectiveInputs = (slot)=>{
        return slot;
    };
    // Helper to find valid default ID when switching groups
    const getDefaultIdForGroup = (groupName)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find((i)=>i.group === groupName)?.id || __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"][0].id;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-5xl mx-auto w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-3xl font-bold mb-6 flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg",
                        children: "1"
                    }, void 0, false, {
                        fileName: "[project]/components/StepInstruments.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Band Members & Instruments"
                ]
            }, void 0, true, {
                fileName: "[project]/components/StepInstruments.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            data.members.map((member, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative bg-slate-700/50 rounded-lg p-1 animate-fadeIn border border-slate-600/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute top-2 left-2 z-10 text-xs font-mono font-bold text-white bg-slate-600 px-2 py-0.5 rounded",
                                            children: [
                                                "#",
                                                index + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StepInstruments.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-[250px] md:hidden w-full p-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MemberPreview3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MemberPreview3D"], {
                                                member: member
                                            }, void 0, false, {
                                                fileName: "[project]/components/StepInstruments.tsx",
                                                lineNumber: 79,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepInstruments.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden md:block md:absolute md:left-1 md:top-1 md:bottom-1 md:w-[216px] p-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MemberPreview3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MemberPreview3D"], {
                                                member: member
                                            }, void 0, false, {
                                                fileName: "[project]/components/StepInstruments.tsx",
                                                lineNumber: 82,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepInstruments.tsx",
                                            lineNumber: 81,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 pt-0 md:pt-4 md:pl-[228px] space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col sm:flex-row gap-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-slate-400 block mb-1",
                                                                children: "Member Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/StepInstruments.tsx",
                                                                lineNumber: 89,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: member.name,
                                                                onChange: (e)=>updateMemberName(member.id, e.target.value),
                                                                placeholder: "e.g. John",
                                                                className: "w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/StepInstruments.tsx",
                                                                lineNumber: 90,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                        lineNumber: 88,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-slate-900/50 p-4 rounded-lg border border-slate-600/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs text-slate-400 block mb-3 font-bold uppercase tracking-wide",
                                                            children: "Instruments & Gear"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                            lineNumber: 101,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                member.instruments.map((slot, iIndex)=>{
                                                                    const currentInstrument = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].find((i)=>i.id === slot.instrumentId);
                                                                    const variants = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"].filter((i)=>i.group === currentInstrument?.group);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col gap-2 bg-slate-800/50 p-2 rounded border border-slate-700/50",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex gap-2 items-center",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                        value: currentInstrument?.group || uniqueGroups[0],
                                                                                        onChange: (e)=>updateMemberInstrument(member.id, iIndex, getDefaultIdForGroup(e.target.value)),
                                                                                        className: "flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer",
                                                                                        children: uniqueGroups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                value: group,
                                                                                                children: group
                                                                                            }, group, false, {
                                                                                                fileName: "[project]/components/StepInstruments.tsx",
                                                                                                lineNumber: 116,
                                                                                                columnNumber: 45
                                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                        lineNumber: 110,
                                                                                        columnNumber: 41
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>removeMemberInstrument(member.id, iIndex),
                                                                                        disabled: member.instruments.length === 1,
                                                                                        className: `p-2 rounded transition-colors ${member.instruments.length === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400 hover:bg-slate-900'}`,
                                                                                        title: "Remove instrument",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                            size: 16
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                            lineNumber: 125,
                                                                                            columnNumber: 45
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                        lineNumber: 119,
                                                                                        columnNumber: 41
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/StepInstruments.tsx",
                                                                                lineNumber: 109,
                                                                                columnNumber: 37
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            variants.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex flex-wrap gap-2",
                                                                                children: variants.map((variant)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>updateMemberInstrument(member.id, iIndex, variant.id),
                                                                                        className: `text-[10px] sm:text-xs px-2 py-1.5 rounded-md border font-medium transition-all ${slot.instrumentId === variant.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'}`,
                                                                                        children: variant.variantLabel || variant.name
                                                                                    }, variant.id, false, {
                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                        lineNumber: 133,
                                                                                        columnNumber: 49
                                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/StepInstruments.tsx",
                                                                                lineNumber: 131,
                                                                                columnNumber: 41
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            (()=>{
                                                                                const effectiveInputs = slot.inputs?.length ? slot.inputs : (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$inputUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultInputsForSlot"])(slot, __TURBOPACK__imported__module__$5b$project$5d2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INSTRUMENTS"]);
                                                                                const isExpanded = expandedInputs.has(`${member.id}-${iIndex}`);
                                                                                const inputCount = effectiveInputs.length;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "border-t border-slate-700/50 pt-2 mt-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>toggleInputsExpanded(member.id, iIndex),
                                                                                            className: "text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium px-1 py-1",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                                    size: 14,
                                                                                                    className: `transition-transform ${isExpanded ? 'rotate-180' : ''}`
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                                                                    lineNumber: 162,
                                                                                                    columnNumber: 45
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                "Inputs (",
                                                                                                inputCount,
                                                                                                " CH)"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                            lineNumber: 158,
                                                                                            columnNumber: 43
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "mt-3 bg-slate-900/30 p-3 rounded border border-slate-700/30",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "grid grid-cols-[1.5rem_1fr_1fr_2rem] sm:grid-cols-[1fr_1fr_1fr_2rem] gap-x-2 items-center text-xs font-bold text-slate-400 mb-2 pb-2 border-b border-slate-700",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "sm:hidden",
                                                                                                            children: "#"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                                            lineNumber: 169,
                                                                                                            columnNumber: 49
                                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            children: "Channel"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                                            lineNumber: 170,
                                                                                                            columnNumber: 49
                                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            children: "Mic / DI"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                                            lineNumber: 171,
                                                                                                            columnNumber: 49
                                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "sm:col-start-4"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                                            lineNumber: 172,
                                                                                                            columnNumber: 49
                                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "col-start-2 col-span-2 sm:col-start-3 sm:row-start-1 sm:col-span-1",
                                                                                                            children: "Notes"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                                            lineNumber: 173,
                                                                                                            columnNumber: 49
                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                                                                    lineNumber: 168,
                                                                                                    columnNumber: 47
                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "space-y-2",
                                                                                                    children: [
                                                                                                        effectiveInputs.map((input, inputIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                className: "grid grid-cols-[1.5rem_1fr_1fr_2rem] sm:grid-cols-[1fr_1fr_1fr_2rem] gap-x-2 gap-y-1.5 items-center text-xs",
                                                                                                                children: [
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                                        className: "sm:hidden text-[10px] text-slate-500 text-right leading-none",
                                                                                                                        children: [
                                                                                                                            "#",
                                                                                                                            inputIdx + 1
                                                                                                                        ]
                                                                                                                    }, void 0, true, {
                                                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                        lineNumber: 178,
                                                                                                                        columnNumber: 51
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                        type: "text",
                                                                                                                        value: input.label,
                                                                                                                        onChange: (e)=>{
                                                                                                                            const updated = [
                                                                                                                                ...effectiveInputs
                                                                                                                            ];
                                                                                                                            updated[inputIdx] = {
                                                                                                                                ...updated[inputIdx],
                                                                                                                                label: e.target.value
                                                                                                                            };
                                                                                                                            updateInstrumentInputs(member.id, iIndex, updated);
                                                                                                                        },
                                                                                                                        placeholder: "e.g. Kick",
                                                                                                                        className: "min-w-0 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-indigo-500"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                        lineNumber: 179,
                                                                                                                        columnNumber: 51
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                        type: "text",
                                                                                                                        list: `mic-suggestions-${member.id}-${iIndex}`,
                                                                                                                        value: input.micDi,
                                                                                                                        onChange: (e)=>{
                                                                                                                            const updated = [
                                                                                                                                ...effectiveInputs
                                                                                                                            ];
                                                                                                                            updated[inputIdx] = {
                                                                                                                                ...updated[inputIdx],
                                                                                                                                micDi: e.target.value
                                                                                                                            };
                                                                                                                            updateInstrumentInputs(member.id, iIndex, updated);
                                                                                                                        },
                                                                                                                        placeholder: "e.g. SM57, DI",
                                                                                                                        className: "min-w-0 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-indigo-500"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                        lineNumber: 190,
                                                                                                                        columnNumber: 51
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                                                                                                        id: `mic-suggestions-${member.id}-${iIndex}`,
                                                                                                                        children: MIC_SUGGESTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                                                value: opt
                                                                                                                            }, opt, false, {
                                                                                                                                fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                                lineNumber: 204,
                                                                                                                                columnNumber: 55
                                                                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                        lineNumber: 202,
                                                                                                                        columnNumber: 51
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                                        onClick: ()=>{
                                                                                                                            const updated = effectiveInputs.filter((_, idx)=>idx !== inputIdx);
                                                                                                                            updateInstrumentInputs(member.id, iIndex, updated);
                                                                                                                        },
                                                                                                                        disabled: effectiveInputs.length === 1,
                                                                                                                        className: `sm:col-start-4 sm:row-start-1 p-1 rounded transition-colors flex items-center justify-center ${effectiveInputs.length === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400 hover:bg-slate-900'}`,
                                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                                                            size: 14
                                                                                                                        }, void 0, false, {
                                                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                            lineNumber: 215,
                                                                                                                            columnNumber: 53
                                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                        lineNumber: 207,
                                                                                                                        columnNumber: 51
                                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                                                        type: "text",
                                                                                                                        value: input.notes || '',
                                                                                                                        onChange: (e)=>{
                                                                                                                            const updated = [
                                                                                                                                ...effectiveInputs
                                                                                                                            ];
                                                                                                                            updated[inputIdx] = {
                                                                                                                                ...updated[inputIdx],
                                                                                                                                notes: e.target.value
                                                                                                                            };
                                                                                                                            updateInstrumentInputs(member.id, iIndex, updated);
                                                                                                                        },
                                                                                                                        placeholder: "e.g. Own mic",
                                                                                                                        className: "col-start-2 col-span-2 sm:col-start-3 sm:row-start-1 sm:col-span-1 min-w-0 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-indigo-500"
                                                                                                                    }, void 0, false, {
                                                                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                        lineNumber: 217,
                                                                                                                        columnNumber: 51
                                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                                ]
                                                                                                            }, inputIdx, true, {
                                                                                                                fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                lineNumber: 177,
                                                                                                                columnNumber: 49
                                                                                                            }, ("TURBOPACK compile-time value", void 0))),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>{
                                                                                                                const updated = [
                                                                                                                    ...effectiveInputs,
                                                                                                                    {
                                                                                                                        label: '',
                                                                                                                        micDi: 'DI',
                                                                                                                        stand: ''
                                                                                                                    }
                                                                                                                ];
                                                                                                                updateInstrumentInputs(member.id, iIndex, updated);
                                                                                                            },
                                                                                                            className: "text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium px-1 mt-2",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                                                                    size: 12
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                                                                                    lineNumber: 237,
                                                                                                                    columnNumber: 49
                                                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                                                " Add input"
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                                            lineNumber: 230,
                                                                                                            columnNumber: 47
                                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                                                                    lineNumber: 175,
                                                                                                    columnNumber: 47
                                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                                            lineNumber: 167,
                                                                                            columnNumber: 45
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                                                    lineNumber: 157,
                                                                                    columnNumber: 41
                                                                                }, ("TURBOPACK compile-time value", void 0));
                                                                            })()
                                                                        ]
                                                                    }, iIndex, true, {
                                                                        fileName: "[project]/components/StepInstruments.tsx",
                                                                        lineNumber: 108,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0));
                                                                }),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addMemberInstrument(member.id),
                                                                    className: "text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 mt-3 font-medium px-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                                            lineNumber: 251,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        " Add another instrument"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                                    lineNumber: 247,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/StepInstruments.tsx",
                                                            lineNumber: 102,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StepInstruments.tsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>removeMember(member.id),
                                            className: "absolute top-2 right-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded p-2 transition-colors z-10",
                                            title: "Remove member",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/components/StepInstruments.tsx",
                                                lineNumber: 261,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepInstruments.tsx",
                                            lineNumber: 256,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, member.id, true, {
                                    fileName: "[project]/components/StepInstruments.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: addMember,
                                className: "w-full py-6 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 font-bold text-lg group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-slate-700 group-hover:bg-indigo-900 p-2 rounded-full transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "group-hover:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepInstruments.tsx",
                                            lineNumber: 271,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepInstruments.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Add Band Member"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StepInstruments.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/StepInstruments.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    data.members.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-bold text-slate-400 uppercase tracking-wider mb-3",
                                children: "Quick Start Templates"
                            }, void 0, false, {
                                fileName: "[project]/components/StepInstruments.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: applyRockTemplate,
                                className: "w-full sm:w-auto bg-gradient-to-r from-indigo-900 to-slate-800 border border-indigo-500/30 hover:border-indigo-500 p-4 rounded-xl text-left transition-all hover:shadow-lg hover:shadow-indigo-500/20 group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-indigo-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StepInstruments.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 20
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/StepInstruments.tsx",
                                                lineNumber: 285,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-bold text-white text-lg",
                                                children: "Rock Band"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StepInstruments.tsx",
                                                lineNumber: 288,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StepInstruments.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-400 text-sm pl-[52px]",
                                        children: "Drums, Bass, Electric Guitar, Lead Vocals"
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepInstruments.tsx",
                                        lineNumber: 290,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StepInstruments.tsx",
                                lineNumber: 280,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/StepInstruments.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/StepInstruments.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/StepInstruments.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StepInstruments, "3AWdNahgMnNJJIekVNlHF6nH/EM=");
_c = StepInstruments;
var _c;
__turbopack_context__.k.register(_c, "StepInstruments");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/StepInstruments.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/StepInstruments.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_ce49d73b._.js.map