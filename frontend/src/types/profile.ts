export interface AcademicDetails {
  grade: string;
  stream: string;
  courses: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  academic?: AcademicDetails;
}
