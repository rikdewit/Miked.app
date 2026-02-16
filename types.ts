
export enum InstrumentType {
  VOCAL = 'Vocal',
  GUITAR = 'Guitar',
  BASS = 'Bass',
  DRUMS = 'Drums',
  KEYS = 'Keys',
  BRASS = 'Brass',
  STRINGS = 'Strings',
  OTHER = 'Other'
}

export type PersonPose = 'stand' | 'guitar' | 'bass' | 'acoustic' | 'drums' | 'keys' | 'trumpet' | 'singing' | 'dj' | 'sax';

export interface InstrumentDefinition {
  id: string;
  name: string; // The specific name (e.g. "Guitar (Modeler)")
  group: string; // The UI Label (e.g. "Electric Guitar")
  variantLabel?: string; // Short label for the toggle (e.g. "Modeler")
  type: InstrumentType;
  defaultMic?: string;
  defaultDi?: boolean;
  requiresMonitor?: boolean;
  icon: string; // Icon name reference
}

export interface BandMember {
  id: string;
  name: string;
  instrumentIds: string[];
  notes?: string;
}

export interface StageItem {
  id: string;
  memberId?: string; // If linked to a band member
  type: 'member' | 'monitor' | 'power' | 'drumriser' | 'person' | 'stand';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  rotation?: number;
  fromInstrumentIndex?: number; // Which instrument slot created this item
  isPeripheral?: boolean; // If true, this item is removed when swapping variants (e.g. Amp), vs Core items (Guitar Body)
  quantity?: number; // For power items: number of outlets/strips
  monitorNumber?: number; // For monitor items: display number
}

export interface RiderDetails {
  bandName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  logoUrl?: string; // Base64 string
  generalNotes?: string;
  showDuration?: string;
  soundcheckDuration?: string;
  stageWidth?: number;
  stageDepth?: number;
  stageDimensionUnit?: 'm' | 'ft';
}

export interface RiderData {
  members: BandMember[];
  stagePlot: StageItem[];
  details: RiderDetails;
}