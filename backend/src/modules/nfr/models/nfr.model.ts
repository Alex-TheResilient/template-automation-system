import { RiskResponse } from './risk.model';

export interface NfrDTO {
  name: string;
  qualityAttribute: string;
  description: string;
  status: string;
  importance: string;
  comment?: string;
  projectId: string;
}

export interface NfrResponse {
  id: string;
  code: string;
  version: string;
  name: string;
  qualityAttribute: string;
  description: string;
  creationDate: Date;
  modificationDate?: Date | null;
  status: string;
  importance: string;
  comment?: string | null;
  projectId: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface NfrWithRisksResponse extends NfrResponse {
  risks: RiskResponse[];
}