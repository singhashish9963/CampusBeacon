export interface Subject {
  id: number;
  name: string;
  icon: string;
  totalClasses: number;
  attendedClasses: number;
  goal: number;
  streak: number;
  lastAttendance: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface SubjectStats {
  attendancePercent: number;
  streak: number;
  status: "good" | "warning" | "danger";
  needed: number;
}

export interface NotificationType {
  type: "success" | "error";
  message: string;
}
