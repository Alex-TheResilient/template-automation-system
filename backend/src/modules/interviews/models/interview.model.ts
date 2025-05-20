// filepath: d:\PIS2_2025A\template-automation-system\backend\src\modules\interviews\models\interview.model.ts

export interface InterviewDTO {
  interviewName: string;
  interviewDate: Date;
  intervieweeName: string;
  intervieweeRole: string;
  startTime: Date;
  endTime: Date;
  observations: string;
}

export interface InterviewResponse {
  id: string;
  interviewName: string;
  version: string;
  interviewDate: Date;
  authorId: string;
  intervieweeName: string;
  intervieweeRole?: string | null;
  startTime: Date| null;
  endTime: Date | null;
  observations?: string | null;
  projectId: string;
}