// controllers/author.controller.ts - Versión final con organizaciones
import { Request, Response } from 'express';
import { authorService } from '../services/author.service';
import { AuthorDTO } from '../models/author.model';

export class AuthorController {
  /**
   * Creates a new author with all validations
   */
  async createAuthor(req: Request, res: Response) {
    try {
      const authorDto: AuthorDTO = req.body;

      if (!authorDto.firstName || authorDto.firstName.trim() === '') {
        return res.status(400).json({ error: 'First name is required.' });
      }

      const newAuthor = await authorService.createAuthor(authorDto);

      res.status(201).json({
        message: 'Author created successfully.',
        author: newAuthor,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating author:', err.message);
      
      if (err.message === 'DNI already exists') {
        return res.status(400).json({ error: 'DNI already exists.' });
      }
      
      if (err.message === 'Organization not found') {
        return res.status(400).json({ error: 'Organization not found.' });
      }
      
      if (err.message === 'Template author not found') {
        return res.status(400).json({ error: 'Template author not found.' });
      }
      
      res.status(500).json({ error: err.message || 'Error creating author.' });
    }
  }

  /**
   * Updates an author with version increment
   */
  async updateAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authorDto: Partial<AuthorDTO> = req.body;

      const updatedAuthor = await authorService.updateAuthor(id, authorDto);

      res.status(200).json({
        message: `Author updated successfully. New version: ${updatedAuthor.version}`,
        author: updatedAuthor,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      if (err.message === 'DNI already exists') {
        return res.status(400).json({ error: 'DNI already exists.' });
      }
      
      if (err.message === 'Organization not found') {
        return res.status(400).json({ error: 'Organization not found.' });
      }
      
      res.status(500).json({ error: err.message || 'Error updating author.' });
    }
  }

  /**
   * Gets organization options for dropdown
   */
  async getOrganizationOptions(req: Request, res: Response) {
    try {
      const organizations = await authorService.getOrganizationOptions();

      res.status(200).json(organizations);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching organizations:', err.message);
      res.status(500).json({ error: 'Error fetching organizations.' });
    }
  }

  /**
   * Gets template author options for dropdown
   */
  async getTemplateAuthorOptions(req: Request, res: Response) {
    try {
      const templateAuthors = await authorService.getTemplateAuthorOptions();

      res.status(200).json(templateAuthors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching template authors:', err.message);
      res.status(500).json({ error: 'Error fetching template authors.' });
    }
  }

  /**
   * Copies permissions from template author
   */
  async copyPermissionsFromTemplate(req: Request, res: Response) {
    try {
      const { templateAuthorId } = req.params;

      const permissions = await authorService.copyPermissionsFromTemplate(templateAuthorId);

      res.status(200).json({
        message: 'Permissions copied successfully.',
        permissions,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error copying permissions:', err.message);
      
      if (err.message === 'Template author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error copying permissions.' });
    }
  }

  /**
   * Gets version history for an author
   */
  async getVersionHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const history = await authorService.getVersionHistory(id);

      res.status(200).json(history);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching version history:', err.message);
      res.status(500).json({ error: 'Error fetching version history.' });
    }
  }

  /**
   * Gets authors by specific permission
   */
  async getAuthorsByPermission(req: Request, res: Response) {
    try {
      const { permission } = req.params;

      const authors = await authorService.getAuthorsByPermission(permission);

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors by permission:', err.message);
      res.status(500).json({ error: 'Error fetching authors by permission.' });
    }
  }

  /**
   * Bulk update permissions for multiple authors
   */
  async bulkUpdatePermissions(req: Request, res: Response) {
    try {
      const { authorIds, permissions } = req.body;

      if (!authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
        return res.status(400).json({ error: 'Author IDs array is required.' });
      }

      if (!permissions) {
        return res.status(400).json({ error: 'Permissions object is required.' });
      }

      const results = await authorService.bulkUpdatePermissions(authorIds, permissions);

      res.status(200).json({
        message: 'Bulk permissions update completed.',
        results,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error in bulk permissions update:', err.message);
      res.status(500).json({ error: 'Error in bulk permissions update.' });
    }
  }

  /**
   * Gets enhanced statistics with permissions
   */
  async getAuthorStats(req: Request, res: Response) {
    try {
      const stats = await authorService.getAuthorStats();

      res.status(200).json({
        ...stats,
        message: 'Statistics retrieved successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching author stats:', err.message);
      res.status(500).json({ error: 'Error fetching author stats.' });
    }
  }

  /**
   * Deletes an author safely (removes from interviews first)
   */
  async deleteAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await authorService.deleteAuthor(id);

      res.status(200).json({
        message: 'Author deleted successfully. Associated interviews were updated.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deleting author.' });
    }
  }

  // ... métodos existentes del controller anterior
  async getAuthors(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await authorService.getAuthors(page, limit);

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors:', err.message);
      res.status(500).json({ error: 'Error fetching authors.' });
    }
  }

  async getAuthorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const author = await authorService.getAuthorById(id);

      res.status(200).json(author);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching author.' });
    }
  }

  async searchAuthors(req: Request, res: Response) {
    try {
      const { 
        firstName, 
        paternalSurname, 
        dni, 
        phone, 
        organizationId, 
        status, 
        roleId,
        hasPermissions 
      } = req.query;

      const searchParams: any = {};
      if (firstName) searchParams.firstName = firstName as string;
      if (paternalSurname) searchParams.paternalSurname = paternalSurname as string;
      if (dni) searchParams.dni = dni as string;
      if (phone) searchParams.phone = phone as string;
      if (organizationId) searchParams.organizationId = organizationId as string;
      if (status) searchParams.status = status as string;
      if (roleId) searchParams.roleId = roleId as string;
      if (hasPermissions) {
        searchParams.hasPermissions = Array.isArray(hasPermissions) 
          ? hasPermissions 
          : [hasPermissions];
      }

      const authors = await authorService.searchAuthors(searchParams);

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching authors:', err.message);
      res.status(500).json({ error: 'Error searching authors.' });
    }
  }

  async getAuthorsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const authors = await authorService.getAuthorsByStatus(status);

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors by status:', err.message);
      res.status(500).json({ error: err.message || 'Error fetching authors by status.' });
    }
  }

  async getNextCode(req: Request, res: Response) {
    try {
      const nextCode = await authorService.getNextCodePreview();

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  async activateAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const author = await authorService.activateAuthor(id);

      res.status(200).json({
        message: `Author activated successfully. New version: ${author.version}`,
        author,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error activating author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error activating author.' });
    }
  }

  async deactivateAuthor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const author = await authorService.deactivateAuthor(id);

      res.status(200).json({
        message: `Author deactivated successfully. New version: ${author.version}`,
        author,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deactivating author:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deactivating author.' });
    }
  }

  /**
   * Gets an author by code
   */
  async getAuthorByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const author = await authorService.getAuthorByCode(code);

      res.status(200).json(author);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching author by code:', err.message);
      
      if (err.message === 'Author not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching author by code.' });
    }
  }

  /**
   * Gets authors by role
   */
  async getAuthorsByRole(req: Request, res: Response) {
    try {
      const { roleId } = req.params;
      const authors = await authorService.getAuthorsByRole(roleId);

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors by role:', err.message);
      res.status(500).json({ error: 'Error fetching authors by role.' });
    }
  }

  /**
   * Gets authors with interview count
   */
  async getAuthorsWithInterviewCount(req: Request, res: Response) {
    try {
      const authors = await authorService.getAuthorsWithInterviewCount();

      res.status(200).json(authors);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching authors with interview count:', err.message);
      res.status(500).json({ error: 'Error fetching authors with interview count.' });
    }
  }

  /**
   * Bulk update authors status
   */
  async bulkUpdateAuthorStatus(req: Request, res: Response) {
    try {
      const { authorIds, status } = req.body;

      if (!authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
        return res.status(400).json({ error: 'Author IDs array is required.' });
      }

      if (!status || !['Active', 'Inactive'].includes(status)) {
        return res.status(400).json({ error: 'Valid status (Active/Inactive) is required.' });
      }

      const results = await authorService.bulkUpdateAuthorStatus(authorIds, status);

      res.status(200).json({
        message: 'Bulk update completed.',
        results,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error in bulk update:', err.message);
      res.status(500).json({ error: 'Error in bulk update.' });
    }
  }

  /**
   * Exports authors to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      const authors = await authorService.getAuthorsWithInterviewCount();

      // Simple response for now - implement Excel export if needed
      res.status(200).json({
        message: 'Excel export would be generated here',
        count: authors.length,
        authors: authors.slice(0, 5) // Preview
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting to Excel.' });
    }
  }

  /**
   * Exports authors to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      const authors = await authorService.getAuthorsWithInterviewCount();

      // Simple response for now - implement PDF export if needed
      res.status(200).json({
        message: 'PDF export would be generated here',
        count: authors.length,
        authors: authors.slice(0, 5) // Preview
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting to PDF.' });
    }
  }
}

// Export singleton instance of the controller
export const authorController = new AuthorController();