import { projectRepository } from '../repositories/project.repository';
import { ProjectDTO } from '../models/project.model';

export class ProjectService {
  private repository = projectRepository;

  /**
   * Creates a new project
   */
  async createProject(organizationCode: string, data: ProjectDTO) {
    return this.repository.create(organizationCode, data);
  }

  /**
   * Updates an existing project
   */
  async updateProject(organizationCode: string, projectCode: string, data: Partial<ProjectDTO>) {
    return this.repository.update(organizationCode, projectCode, data);
  }

  /**
   * Deletes a project
   */
  async deleteProject(organizationCode: string, projectCode: string) {
    return this.repository.delete(organizationCode, projectCode);
  }

  /**
   * Gets a project by organization code and project code
   */
  async getProjectByOrgAndCode(organizationCode: string, projectCode: string) {
    return this.repository.findByOrgAndCode(organizationCode, projectCode);
  }

  /**
   * Gets all projects for an organization
   */
  async getProjectsByOrganization(organizationCode: string) {
    return this.repository.findByOrganization(organizationCode);
  }

  /**
   * Searches projects by name
   */
  async searchProjectsByName(organizationCode: string, name: string) {
    return this.repository.searchByName(organizationCode, name);
  }

  /**
   * Searches projects by date
   */
  async searchProjectsByDate(organizationCode: string, year?: string, month?: string) {
    return this.repository.searchByDate(organizationCode, year, month);
  }

  /**
   * Gets the next unique code for a project
   */
  async getNextCode(organizationCode: string): Promise<string> {
    return this.repository.getNextCode(organizationCode);
  }
}

// Export singleton instance of the service
export const projectService = new ProjectService();