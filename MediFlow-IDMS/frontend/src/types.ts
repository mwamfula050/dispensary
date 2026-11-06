export type User = { username: string; fullName: string; role: string };
export type Patient = {
  id: number; patientNumber: string; fullName: string; phone?: string;
  sex?: string; dateOfBirth?: string; address?: string;
};
export type Visit = {
  id: number; patient: Patient; registeredAt: string; status: string;
  department?: string; priority?: string; triageNotes?: string;
  bloodPressure?: string; temperature?: number; weight?: number; height?: number;
  pulseRate?: number; respiratoryRate?: number; oxygenSaturation?: number;
  nurseNotes?: string; triagedBy?: string; triagedAt?: string;
  symptoms?: string; symptomDuration?: string; medicalHistory?: string;
  examination?: string; provisionalDiagnosis?: string; diagnosis?: string;
  consultationNotes?: string; advice?: string; medicineInstructions?: string;
  doctorUsername?: string;
};
