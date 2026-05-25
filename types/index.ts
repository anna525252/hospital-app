export interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
  experience: number;
  isAvailable: boolean;
  email?: string;
  gender: "male" | "female";
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  diagnosis: string;
  admittedAt: string;
  isCritical: boolean;
  doctorId: string;
  notes?: string;
  doctor?: Doctor;
}
