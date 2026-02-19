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
"[project]/components/StepStagePlot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepStagePlot",
    ()=>StepStagePlot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/alert-triangle.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StagePlotCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/StagePlotCanvas.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MemberPreview3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MemberPreview3D.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageConfig.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/stageHelpers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$3d$2f$StageModels$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/3d/StageModels.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const StepStagePlot = ({ data, setData, updateStageItems })=>{
    _s();
    const [stageViewMode, setStageViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('isometric');
    const [draggingMemberId, setDraggingMemberId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showClearConfirm, setShowClearConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rotatingItemId, setRotatingItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Stores the Percentage Position (0-100) on the stage
    const [dragPos, setDragPos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Stores the raw pixel coordinates for the canvas to process
    const [rawDragCoords, setRawDragCoords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Ref for the custom drag image
    const dragLabelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [dragLabelText, setDragLabelText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const isMemberFullyPlaced = (member)=>{
        // 1. Check if Person exists
        const hasPerson = data.stagePlot.some((item)=>item.memberId === member.id && item.type === 'person');
        if (!hasPerson) return false;
        // 2. Strict check: Do we have all the specific gear items we expect?
        const expectedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateMemberItems"])(member, 50, 50);
        for (const expected of expectedItems){
            if (expected.type === 'person') continue;
            // Find a matching item on stage
            // Match by: MemberID, InstrumentIndex, and Label
            const match = data.stagePlot.find((existing)=>existing.memberId === member.id && existing.fromInstrumentIndex === expected.fromInstrumentIndex && existing.label === expected.label);
            if (!match) return false;
        }
        return true;
    };
    const getPlacementStatus = (member)=>{
        const hasPerson = data.stagePlot.some((item)=>item.memberId === member.id && item.type === 'person');
        const isFull = isMemberFullyPlaced(member);
        if (isFull) return 'full';
        if (hasPerson) return 'partial';
        return 'none';
    };
    const requestClearStage = ()=>{
        if (data.stagePlot.length > 0) {
            setShowClearConfirm(true);
        }
    };
    const confirmClearStage = ()=>{
        updateStageItems([]);
        setShowClearConfirm(false);
    };
    // --- Rotation Handlers ---
    const handleRotateItem = (itemId, direction)=>{
        const ROTATION_STEP = 22.5 * (Math.PI / 180); // Convert degrees to radians
        const item = data.stagePlot.find((i)=>i.id === itemId);
        if (!item) return;
        const currentRotation = item.rotation || 0;
        const newRotation = direction === 'right' ? currentRotation - ROTATION_STEP : currentRotation + ROTATION_STEP;
        // Normalize to 0-2π
        const normalizedRotation = (newRotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        updateStageItems(data.stagePlot.map((i)=>i.id === itemId ? {
                ...i,
                rotation: normalizedRotation
            } : i));
    };
    // --- Drag & Drop Handlers ---
    const handleDragStart = (e, memberId, memberName)=>{
        e.dataTransfer.setData("memberId", memberId);
        e.dataTransfer.effectAllowed = "copy";
        setDraggingMemberId(memberId);
        // Set custom drag image (just the label)
        setDragLabelText(memberName);
        if (dragLabelRef.current) {
            e.dataTransfer.setDragImage(dragLabelRef.current, 0, 0);
        }
    };
    const handleDragOver = (e)=>{
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setRawDragCoords({
            x,
            y,
            width: rect.width,
            height: rect.height
        });
    };
    const handleGhostUpdate = (x, y)=>{
        if (!draggingMemberId) return;
        const member = data.members.find((m)=>m.id === draggingMemberId);
        if (!member) return;
        // 1. Generate items at the proposed center to check bounds
        const tempItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateMemberItems"])(member, x, y, 'temp-bounds-check');
        let minX = 100, maxX = 0, minY = 100, maxY = 0;
        tempItems.forEach((item)=>{
            const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getItemConfig"])(item);
            // Convert World Dimensions to Percentage
            const wPercent = config.width / __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] * 100;
            const dPercent = config.depth / __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] * 100;
            const halfW = wPercent / 2;
            const halfD = dPercent / 2;
            // Determine Visual Offset (Matches StageDraggableItem logic)
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
            const [offX, _, offZ] = offset;
            // Convert Offset to Percent
            const offXPercent = offX / __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_WIDTH"] * 100;
            const offZPercent = offZ / __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageConfig$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGE_DEPTH"] * 100;
            // Apply offset to center position for bounds check
            const visualCenterX = item.x + offXPercent;
            const visualCenterY = item.y + offZPercent;
            const iMinX = visualCenterX - halfW;
            const iMaxX = visualCenterX + halfW;
            const iMinY = visualCenterY - halfD;
            const iMaxY = visualCenterY + halfD;
            if (iMinX < minX) minX = iMinX;
            if (iMaxX > maxX) maxX = iMaxX;
            if (iMinY < minY) minY = iMinY;
            if (iMaxY > maxY) maxY = iMaxY;
        });
        // 2. Calculate Shift needed to fit in 0-100 with margin
        let shiftX = 0;
        let shiftY = 0;
        const MARGIN = 0.5; // Small margin to prevent clipping
        if (minX < MARGIN) shiftX = MARGIN - minX;
        else if (maxX > 100 - MARGIN) shiftX = 100 - MARGIN - maxX;
        if (minY < MARGIN) shiftY = MARGIN - minY;
        else if (maxY > 100 - MARGIN) shiftY = 100 - MARGIN - maxY;
        setDragPos({
            x: x + shiftX,
            y: y + shiftY
        });
    };
    const handleDragLeave = (e)=>{
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setDragPos(null);
        setRawDragCoords(null);
    };
    const handleDragEnd = ()=>{
        setDraggingMemberId(null);
        setDragPos(null);
        setRawDragCoords(null);
    };
    // --- Click to Place Handler ---
    const handleMemberClick = (memberId)=>{
        const member = data.members.find((m)=>m.id === memberId);
        if (!member) return;
        const status = getPlacementStatus(member);
        if (status === 'full') {
            alert(`${member.name} is already on the stage.`);
            return;
        }
        // Place at center of stage
        const centerX = 50;
        const centerY = 50;
        const potentialItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateMemberItems"])(member, centerX, centerY);
        const hasPerson = data.stagePlot.some((i)=>i.memberId === memberId && i.type === 'person');
        const itemsToAdd = potentialItems.filter((newItem)=>{
            if (newItem.type === 'person' && hasPerson) return false;
            if (newItem.fromInstrumentIndex !== undefined) {
                const index = newItem.fromInstrumentIndex;
                const existingCore = data.stagePlot.find((i)=>i.memberId === memberId && i.fromInstrumentIndex === index && !i.isPeripheral);
                if (!newItem.isPeripheral && existingCore) return false;
                const existingSameItem = data.stagePlot.find((i)=>i.memberId === memberId && i.fromInstrumentIndex === index && i.label === newItem.label);
                if (existingSameItem) return false;
            }
            return true;
        });
        updateStageItems([
            ...data.stagePlot,
            ...itemsToAdd
        ]);
    };
    const handleDrop = (e)=>{
        e.preventDefault();
        const memberId = e.dataTransfer.getData("memberId");
        const finalPos = dragPos; // Use the clamped position
        setDraggingMemberId(null);
        setDragPos(null);
        setRawDragCoords(null);
        if (!memberId || !finalPos) return;
        const member = data.members.find((m)=>m.id === memberId);
        if (!member) return;
        // Check if fully placed
        if (isMemberFullyPlaced(member)) {
            alert(`${member.name} is already on the stage.`);
            return;
        }
        // Generate potential items at drop location
        const potentialItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateMemberItems"])(member, finalPos.x, finalPos.y);
        // Filter Items to avoid duplication
        // 1. If Person exists, remove new Person
        const hasPerson = data.stagePlot.some((i)=>i.memberId === memberId && i.type === 'person');
        const itemsToAdd = potentialItems.filter((newItem)=>{
            // Skip Person if already on stage
            if (newItem.type === 'person' && hasPerson) return false;
            // Smart Filtering for Instrument Gear:
            if (newItem.fromInstrumentIndex !== undefined) {
                const index = newItem.fromInstrumentIndex;
                const existingCore = data.stagePlot.find((i)=>i.memberId === memberId && i.fromInstrumentIndex === index && !i.isPeripheral);
                // If new item is Core, and we already have a Core item for this index -> Skip new core
                if (!newItem.isPeripheral && existingCore) return false;
                // Peripherals (like Amps/DI) are always added if dragged, assuming the hook cleared old ones.
                // Duplicate check: prevent adding exact same peripheral type for same index if it somehow exists
                const existingSameItem = data.stagePlot.find((i)=>i.memberId === memberId && i.fromInstrumentIndex === index && i.label === newItem.label);
                if (existingSameItem) return false;
            }
            return true;
        });
        updateStageItems([
            ...data.stagePlot,
            ...itemsToAdd
        ]);
    };
    // Generate Ghost Items for Preview
    const ghostItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StepStagePlot.useMemo[ghostItems]": ()=>{
            if (!draggingMemberId || !dragPos) return [];
            const member = data.members.find({
                "StepStagePlot.useMemo[ghostItems].member": (m)=>m.id === draggingMemberId
            }["StepStagePlot.useMemo[ghostItems].member"]);
            if (!member) return [];
            // Same filtering logic as Drop to show only what will be added
            const potentialItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$stageHelpers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateMemberItems"])(member, dragPos.x, dragPos.y, `ghost-${member.id}`);
            const hasPerson = data.stagePlot.some({
                "StepStagePlot.useMemo[ghostItems].hasPerson": (i)=>i.memberId === draggingMemberId && i.type === 'person'
            }["StepStagePlot.useMemo[ghostItems].hasPerson"]);
            return potentialItems.filter({
                "StepStagePlot.useMemo[ghostItems]": (newItem)=>{
                    if (newItem.type === 'person' && hasPerson) return false;
                    if (newItem.fromInstrumentIndex !== undefined) {
                        const index = newItem.fromInstrumentIndex;
                        const existingCore = data.stagePlot.find({
                            "StepStagePlot.useMemo[ghostItems].existingCore": (i)=>i.memberId === draggingMemberId && i.fromInstrumentIndex === index && !i.isPeripheral
                        }["StepStagePlot.useMemo[ghostItems].existingCore"]);
                        if (!newItem.isPeripheral && existingCore) return false;
                        const existingSameItem = data.stagePlot.find({
                            "StepStagePlot.useMemo[ghostItems].existingSameItem": (i)=>i.memberId === draggingMemberId && i.fromInstrumentIndex === index && i.label === newItem.label
                        }["StepStagePlot.useMemo[ghostItems].existingSameItem"]);
                        if (existingSameItem) return false;
                    }
                    return true;
                }
            }["StepStagePlot.useMemo[ghostItems]"]);
        }
    }["StepStagePlot.useMemo[ghostItems]"], [
        draggingMemberId,
        dragPos,
        data.members,
        data.stagePlot
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex flex-col lg:flex-row gap-4 lg:gap-6 relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: dragLabelRef,
                className: "absolute top-[-9999px] left-[-9999px] bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-md border border-slate-600 shadow-xl whitespace-nowrap z-50 pointer-events-none",
                children: dragLabelText
            }, void 0, false, {
                fileName: "[project]/components/StepStagePlot.tsx",
                lineNumber: 327,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden lg:flex w-[320px] shrink-0 flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-slate-900 border-b border-slate-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-lg text-white",
                                children: "Band Members"
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 337,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-400",
                                children: "Click or drag members onto the stage"
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 338,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/StepStagePlot.tsx",
                        lineNumber: 336,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-4 space-y-4",
                        children: data.members.map((member)=>{
                            const status = getPlacementStatus(member);
                            const isFull = status === 'full';
                            const isPartial = status === 'partial';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                draggable: !isFull,
                                onDragStart: (e)=>handleDragStart(e, member.id, member.name),
                                onDragEnd: handleDragEnd,
                                onClick: ()=>handleMemberClick(member.id),
                                className: `rounded-lg transition-all group relative border ${isFull ? 'bg-slate-900/40 border-slate-700 p-3 cursor-default' : isPartial ? 'bg-slate-800/80 border-indigo-900/50 p-3 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing' : 'bg-slate-700/50 border-transparent p-2 hover:bg-slate-700 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing hover:shadow-lg'}`,
                                children: [
                                    !isFull && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute right-2 top-2 text-slate-500 group-hover:text-indigo-400 z-10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepStagePlot.tsx",
                                            lineNumber: 365,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 364,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center px-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `font-bold text-sm truncate pr-6 ${isFull ? 'text-slate-500' : 'text-white'}`,
                                                children: member.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/StepStagePlot.tsx",
                                                lineNumber: 370,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isFull && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-1 text-[10px] bg-green-900/30 text-green-500 border border-green-900/50 px-2 py-0.5 rounded-full font-medium",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        size: 10
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StepStagePlot.tsx",
                                                        lineNumber: 375,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Placed"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/StepStagePlot.tsx",
                                                lineNumber: 374,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isPartial && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center gap-1 text-[10px] bg-indigo-900/30 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 rounded-full font-medium",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                        size: 10
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/StepStagePlot.tsx",
                                                        lineNumber: 380,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Update"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/StepStagePlot.tsx",
                                                lineNumber: 379,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 369,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !isFull && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-[120px] w-full rounded bg-slate-900/50 mb-1 mt-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MemberPreview3D$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MemberPreview3D"], {
                                            member: member,
                                            isDragging: !!draggingMemberId,
                                            isSidebarPreview: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepStagePlot.tsx",
                                            lineNumber: 388,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 387,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !isFull && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-center text-indigo-300 font-medium py-1 opacity-0 group-hover:opacity-100 transition-opacity",
                                        children: isPartial ? 'Drag to Add New Gear' : 'Drag to Stage'
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 393,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, member.id, true, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 348,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/StepStagePlot.tsx",
                        lineNumber: 341,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/StepStagePlot.tsx",
                lineNumber: 335,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-bold text-white px-4",
                        children: "Click members to place on stage"
                    }, void 0, false, {
                        fileName: "[project]/components/StepStagePlot.tsx",
                        lineNumber: 405,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 overflow-x-auto pb-2 px-4",
                        children: data.members.map((member)=>{
                            const status = getPlacementStatus(member);
                            const isFull = status === 'full';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>handleMemberClick(member.id),
                                className: `flex-shrink-0 rounded-lg transition-all group relative border p-2 text-center min-w-[100px] ${isFull ? 'bg-slate-900/40 border-slate-700 cursor-default' : 'bg-slate-700/50 border-transparent hover:bg-slate-700 hover:border-indigo-500/50 cursor-pointer hover:shadow-lg'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `block font-bold text-xs truncate ${isFull ? 'text-slate-500' : 'text-white'}`,
                                        children: member.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 421,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isFull && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[8px] text-green-400 font-medium",
                                        children: "Placed ✓"
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 425,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, member.id, true, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 412,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/StepStagePlot.tsx",
                        lineNumber: 406,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/StepStagePlot.tsx",
                lineNumber: 404,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mb-4 w-full lg:w-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setStageViewMode('isometric'),
                                className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${stageViewMode === 'isometric' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 442,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "3D View"
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 442,
                                        columnNumber: 39
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 438,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setStageViewMode('top'),
                                className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${stageViewMode === 'top' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 448,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Top View"
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 448,
                                        columnNumber: 42
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 444,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden sm:flex flex-1"
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 452,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const nextMonitorNum = Math.max(...data.stagePlot.filter((i)=>i.type === 'monitor').map((i)=>i.monitorNumber || 0), 0) + 1;
                                    updateStageItems([
                                        ...data.stagePlot,
                                        {
                                            id: `mon-${Date.now()}`,
                                            type: 'monitor',
                                            x: 50,
                                            y: 50,
                                            label: 'Mon',
                                            monitorNumber: nextMonitorNum
                                        }
                                    ]);
                                },
                                className: "flex-1 sm:flex-none px-2 sm:px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600 whitespace-nowrap",
                                children: "+ Mon"
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 455,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateStageItems([
                                        ...data.stagePlot,
                                        {
                                            id: `stand-${Date.now()}`,
                                            type: 'stand',
                                            x: 50,
                                            y: 50,
                                            label: 'Mic Stand'
                                        }
                                    ]),
                                className: "flex-1 sm:flex-none px-2 sm:px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600 whitespace-nowrap",
                                children: "+ Stand"
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 464,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateStageItems([
                                        ...data.stagePlot,
                                        {
                                            id: `pwr-${Date.now()}`,
                                            type: 'power',
                                            x: 50,
                                            y: 50,
                                            label: 'Power',
                                            quantity: 1
                                        }
                                    ]),
                                className: "flex-1 sm:flex-none px-2 sm:px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600 whitespace-nowrap",
                                children: "+ Power"
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 470,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateStageItems([
                                        ...data.stagePlot,
                                        {
                                            id: `custom-${Date.now()}`,
                                            type: 'custom',
                                            x: 50,
                                            y: 50,
                                            label: '',
                                            customWidth: 1.0,
                                            customDepth: 1.0
                                        }
                                    ]),
                                className: "flex-1 sm:flex-none px-2 sm:px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600 whitespace-nowrap",
                                children: "+ Custom"
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 476,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>updateStageItems([
                                        ...data.stagePlot,
                                        {
                                            id: `label-${Date.now()}`,
                                            type: 'custom',
                                            x: 50,
                                            y: 50,
                                            label: 'Label',
                                            customWidth: 0,
                                            customDepth: 0,
                                            labelHeight: 1.7
                                        }
                                    ]),
                                className: "flex-1 sm:flex-none px-2 sm:px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs border border-slate-600 whitespace-nowrap",
                                children: "+ Label"
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 482,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: requestClearStage,
                                disabled: data.stagePlot.length === 0,
                                className: `flex-1 sm:flex-none px-2 sm:px-3 py-2 rounded text-xs flex items-center justify-center gap-1 border transition-colors ${data.stagePlot.length === 0 ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed' : 'bg-red-900/30 hover:bg-red-900/50 text-red-200 border-red-900/50 cursor-pointer'}`,
                                title: "Remove all items from the stage",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        size: 14,
                                        className: "pointer-events-none"
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 499,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/components/StepStagePlot.tsx",
                                        lineNumber: 499,
                                        columnNumber: 74
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 488,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/StepStagePlot.tsx",
                        lineNumber: 436,
                        columnNumber: 14
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative min-h-[300px] sm:min-h-[500px]",
                        onDragOver: handleDragOver,
                        onDragLeave: handleDragLeave,
                        onDrop: handleDrop,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$StagePlotCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StagePlotCanvas"], {
                                items: data.stagePlot,
                                setItems: updateStageItems,
                                editable: true,
                                viewMode: stageViewMode,
                                ghostItems: ghostItems,
                                dragCoords: rawDragCoords,
                                onDragPosChange: handleGhostUpdate,
                                members: data.members,
                                rotatingItemId: rotatingItemId,
                                onRotateItem: handleRotateItem
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 509,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            data.stagePlot.length === 0 && !draggingMemberId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center pointer-events-none p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-slate-700 text-center max-w-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            size: 40,
                                            className: "mx-auto text-slate-500 mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepStagePlot.tsx",
                                            lineNumber: 525,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-white font-bold mb-2 text-base sm:text-lg",
                                            children: "The Stage is Empty"
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepStagePlot.tsx",
                                            lineNumber: 526,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-slate-400 text-xs sm:text-sm",
                                            children: 'Click "Members" to add band members to the stage.'
                                        }, void 0, false, {
                                            fileName: "[project]/components/StepStagePlot.tsx",
                                            lineNumber: 527,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StepStagePlot.tsx",
                                    lineNumber: 524,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/StepStagePlot.tsx",
                                lineNumber: 523,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/StepStagePlot.tsx",
                        lineNumber: 503,
                        columnNumber: 14
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/StepStagePlot.tsx",
                lineNumber: 434,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            showClearConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 mb-4 text-red-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$alert$2d$triangle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/components/StepStagePlot.tsx",
                                    lineNumber: 539,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-white",
                                    children: "Clear Stage?"
                                }, void 0, false, {
                                    fileName: "[project]/components/StepStagePlot.tsx",
                                    lineNumber: 540,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StepStagePlot.tsx",
                            lineNumber: 538,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-300 text-sm mb-6",
                            children: "Are you sure you want to remove all items from the stage? This action cannot be undone."
                        }, void 0, false, {
                            fileName: "[project]/components/StepStagePlot.tsx",
                            lineNumber: 542,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowClearConfirm(false),
                                    className: "px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/StepStagePlot.tsx",
                                    lineNumber: 546,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: confirmClearStage,
                                    className: "px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 text-sm font-bold transition-all",
                                    children: "Yes, Clear All"
                                }, void 0, false, {
                                    fileName: "[project]/components/StepStagePlot.tsx",
                                    lineNumber: 552,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StepStagePlot.tsx",
                            lineNumber: 545,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StepStagePlot.tsx",
                    lineNumber: 537,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/StepStagePlot.tsx",
                lineNumber: 536,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/StepStagePlot.tsx",
        lineNumber: 324,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StepStagePlot, "5Sdq9YTW0jnt6RgtGTFWecQJiB4=");
_c = StepStagePlot;
var _c;
__turbopack_context__.k.register(_c, "StepStagePlot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/StepStagePlot.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/StepStagePlot.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_d748c837._.js.map