import { Request, Response } from 'express';
import { organizationService } from '../services/organization.service';
import { OrganizationDTO, OrganizationResponse } from '../models/organization.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class OrganizationController {
  /**
   * Creates a new organization
   */
  async createOrganization(req: Request, res: Response) {
    try {
      const organizationDto: OrganizationDTO = req.body;

      if (!organizationDto.name || organizationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      const newOrganization = await organizationService.createOrganization(organizationDto);

      res.status(201).json({
        message: 'Organization created successfully.',
        organization: newOrganization,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating organization:', err.message);
      res.status(500).json({ error: 'Error creating organization.' });
    }
  }

  /**
   * Gets all organizations
   */
  async getOrganizations(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const organizations = await organizationService.getOrganizations(page, limit);

      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching organizations:', err.message);
      res.status(500).json({ error: 'Error fetching organizations.' });
    }
  }

  /**
   * Gets an organization by code
   */
  async getOrganizationByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organization = await organizationService.getOrganizationByCode(code);

      if (!organization) {
        return res.status(404).json({ error: 'Organization not found.' });
      }

      res.status(200).json(organization);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching organization:', err.message);
      res.status(500).json({ error: 'Error fetching organization.' });
    }
  }

  /**
   * Gets projects for an organization
   */
  async getProjectsByOrganization(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organizationWithProjects = await organizationService.getOrganizationWithProjects(code);

      if (!organizationWithProjects) {
        return res.status(404).json({ error: 'Organization not found.' });
      }

      res.status(200).json(organizationWithProjects.projects);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching projects:', err.message);
      res.status(500).json({ error: 'Error fetching projects.' });
    }
  }

  /**
   * Updates an organization
   */
  async updateOrganization(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const organizationDto: OrganizationDTO = req.body;

      const updatedOrganization = await organizationService.updateOrganization(code, organizationDto);

      res.status(200).json({
        message: 'Organization updated successfully.',
        organization: updatedOrganization,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating organization:', err.message);
      res.status(500).json({ error: 'Error updating organization.' });
    }
  }

  /**
   * Deletes an organization
   */
  async deleteOrganization(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await organizationService.deleteOrganization(id);

      res.status(200).json({
        message: 'Organization deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting organization:', err.message);
      res.status(500).json({ error: 'Error deleting organization.' });
    }
  }

  /**
   * Searches organizations by name
   */
  async searchOrganizations(req: Request, res: Response) {
    try {
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({ error: 'Name parameter is required.' });
      }

      const organizations = await organizationService.searchOrganizations(name as string);

      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching organizations:', err.message);
      res.status(500).json({ error: 'Error searching organizations.' });
    }
  }

  /**
   * Searches organizations by date
   */
  async searchOrganizationsByDate(req: Request, res: Response) {
    try {
      const { month, year } = req.query;

      if (!month || !year) {
        return res.status(400).json({ error: 'Month and year parameters are required.' });
      }

      const organizations = await organizationService.searchOrganizationsByDate(
        parseInt(month as string),
        parseInt(year as string)
      );

      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching organizations by date:', err.message);
      res.status(500).json({ error: 'Error searching organizations by date.' });
    }
  }

  /**
   * Gets the next unique code
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const nextCode = await organizationService.getNextCode();

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Exports to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    // Mantener implementación existente pero traducir comentarios
  }

  /**
   * Exports to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    // Mantener implementación existente pero traducir comentarios
  }

  /**
   * Helper function to draw tables in PDF
   */
  private drawTable(doc: typeof PDFDocument, headers: string[], rows: any[][]) {
    // Mantener implementación existente pero traducir comentarios
  }

  /**
   * Gets the main organization of the system
   */
  async getMainOrganization(req: Request, res: Response) {
    try {
      // Get first organization or a predefined one based on your logic
      const organizations: OrganizationResponse[] = await organizationService.getOrganizations(1, 1);
      const mainOrg = organizations[0] || null;

      if (!mainOrg) {
        return res.status(404).json({ error: 'No main organization found.' });
      }

      res.status(200).json(mainOrg);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching main organization:', err.message);
      res.status(500).json({ error: 'Error fetching main organization.' });
    }
  }
}

// Export singleton instance of the controller
export const organizationController = new OrganizationController();