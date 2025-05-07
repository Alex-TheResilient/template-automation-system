export interface SourceDTO {
    name: string;
    comment?: string;
    status: string;
  }
  
  export interface SourceResponse {
    id: string;
    code: string;
    version: string;
    creationDate: Date;
    modificationDate?: Date | null;
    name: string;
    comment?: string | null;
    status: string;
    projectId: string;
  }
  
  export interface PaginationParams {
    page: number;
    limit: number;
  }
  