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

export interface InstrumentDefinition {
  id: string;
  name: string;
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
  type: 'member' | 'monitor' | 'power' | 'drumriser';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  rotation?: number;
}

export interface RiderDetails {
  bandName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  logoUrl?: string; // Base64 string
  generalNotes?: string;
}

export interface RiderData {
  members: BandMember[];
  stagePlot: StageItem[];
  details: RiderDetails;
}
