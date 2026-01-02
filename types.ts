export enum VisitType {
  FirstTime = 'First-Time',
  Returning = 'Returning',
}

// Default constants for initialization and fallback
export interface ReasonCategory {
  name: string;
  items: string[];
}

export const DEFAULT_REASONS: ReasonCategory[] = [
  {
    name: 'Facial Procedures',
    items: ['Botox', 'Fillers', 'Thread Lift', 'Facial Rejuvenation']
  },
  {
    name: 'Body Contouring',
    items: ['Liposuction', 'Tummy Tuck', 'Body Lift', 'Breast Procedures']
  },
  {
    name: 'Skin Treatments',
    items: ['Laser Treatment', 'Chemical Peel', 'Microneedling', 'Skin Rejuvenation']
  },
  {
    name: 'Consultation',
    items: ['General Consultation', 'Follow-up', 'Not Sure']
  }
];

export const DEFAULT_SOURCES = [
  'Google Search',
  'Google Ads',
  'Instagram',
  'Facebook',
  'Practo',
  'Google Maps',
  'Friend / Family',
  'Walk-in',
  'Other'
];

// Sources that trigger the Ad Attribution slide
export const AD_SOURCES = ['Google Ads', 'Instagram', 'Facebook'];

export enum AdType {
  Cleaning = 'Teeth Cleaning Ad',
  Braces = 'Braces / Aligners Ad',
  Implants = 'Implants Ad',
  RootCanal = 'Root Canal Ad',
  DontRemember = 'Don\'t Remember',
}

export interface FormOptions {
  reasons: ReasonCategory[];
  sources: string[];
}

export interface PatientFormData {
  visitType?: VisitType;
  fullName: string;
  mobileNumber: string;
  selectedCategory?: string;
  reason?: string;
  leadSource?: string;
  otherSourceDetails?: string;
  adAttribution?: AdType;
}

export interface Patient extends PatientFormData {
  _id: string;
  submittedAt: string;
  status?: string;
}

export interface SlideProps {
  data: PatientFormData;
  updateData: (fields: Partial<PatientFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  options?: string[] | ReasonCategory[];
}
