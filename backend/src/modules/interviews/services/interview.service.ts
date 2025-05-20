import { InterviewRepository } from '../repositories/interview.repository';
import { InterviewDTO, InterviewResponse } from '../models/interview.model';
import { promises } from 'dns';

export class InterviewService {
  private repository = new InterviewRepository();

  /**
   * Creates a new interview
   */
  async createInterview(projectId: string,data: InterviewDTO): Promise<InterviewResponse> {
    return this.repository.create(projectId,data);
  }

  /**
   * Gets all interviews for a specific project
   */
  async getInterviewByProject(projectId: string) {
    return this.repository.findAllByProject(projectId);
  }

  /**
   * Gets an interview by its ID
   */
  async getInterviewById(id: string, projectId?: string) {
    if (projectId) {
      return this.repository.findByCodeAndProject(id, projectId);
    } else {
      return this.repository.findById(id);
    }
  }

  /**
   * Updates an existing interview
   */
  async updateInterview(id: string, data: InterviewDTO) {
    // Verify entrevista exists
    const existingInterview = await this.repository.findById(id);
    if (!existingInterview) {
      throw new Error("Interview not found");
    }

    // Increment version
    const newVersion = this.incrementVersion(existingInterview.version);

    // Pass version as separate parameter
    return this.repository.update(id, data, newVersion);
  }

  /**
   * Deletes an interview by its ID
   */
  async deleteInterview(id: string, projectId: string) {
    const interview = await this.repository.findByCodeAndProject(id, projectId);

    if (!interview ) {
      throw new Error('interview  not found');
    }

    return this.repository.delete(interview.id);
  }

  /**
   * Increments version following XX.YY pattern
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }
  /**
   * Searches for interviews by name
   */
  async searchByName(name: string, projectId: string) {
    return this.repository.searchByName(name, projectId);
  }
}

// Export singleton instance of the service
export const interviewService = new InterviewService();