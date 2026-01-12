export interface RecommendedLecture {
  id?: string;
  title: string;
  youtubeUrl: string;
  teacherId: string;
  studentIds: string[];
  createdAt?: any; // ✅ optional
}
