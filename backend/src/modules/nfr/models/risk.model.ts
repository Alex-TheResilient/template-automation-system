export interface RiskDTO {
    projectId: string;
    entityType: string;
    registryCode: string;
    description: string;
    impact: string;
    probability: string;
    status: string;
    comments?: string;
  }
  
  export interface RiskResponse {
    id: string;
    projectId: string;
    entityType: string;
    registryCode: string;
    code: string;
    description: string;
    impact: string;
    probability: string;
    status: string;
    creationDate: Date;
    comments?: string | null;
  }