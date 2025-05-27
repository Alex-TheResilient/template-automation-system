import { Request, Response } from 'express';
import { educcionService } from '../services/educcion.service';
import { projectService } from '../../../projects/services/project.service';
import { EduccionDTO } from '../models/educcion.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class EduccionController {
  /**
   * Creates a new educcion
   */
  async createEduccion(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const educcionDto: EduccionDTO = req.body;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      if (!educcionDto.name || educcionDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      const newEduccion = await educcionService.createEduccion(project.id, educcionDto);

      res.status(201).json({
        message: 'Educcion created successfully.',
        educcion: newEduccion,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error completo:', err);
      return res.status(500).json({ error: `Error creating educcion: ${err.message}` });
    }
  }

  /**
   * Gets all educciones from a project
   */
  async getEduccionesByProject(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // CAMBIO AQUÍ: Usar project.id (UUID) en lugar de projcod
      const educciones = await educcionService.getEduccionesByProject(project.id, page, limit);

      res.status(200).json(educciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching educciones:', err.message);
      res.status(500).json({ error: 'Error fetching educciones.' });
    }
  }

  /**
   * Gets an educcion by its code
   */
  async getEduccionByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const educcion = await educcionService.getEduccionByCode(educod, project.id);

      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found.' });
      }

      // Verificar que la educción pertenece al proyecto correcto
      if (educcion.projectId !== project.id) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      res.status(200).json(educcion);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching educcion:', err.message);
      res.status(500).json({ error: 'Error fetching educcion.' });
    }
  }

  /**
   * Updates an educcion
   */
  async updateEduccion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;
      const educcionDto: EduccionDTO = req.body;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verificar que la educción existe y pertenece a este proyecto
      const existingEduccion = await educcionService.getEduccionByCode(educod, project.id);

      if (!existingEduccion) {
        return res.status(404).json({ error: 'Educcion not found.' });
      }

      if (existingEduccion.projectId !== project.id) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const updatedEduccion = await educcionService.updateEduccion(educod, educcionDto);

      res.status(200).json({
        message: 'Educcion updated successfully.',
        educcion: updatedEduccion,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating educcion:', err.message);
      res.status(500).json({ error: 'Error updating educcion.' });
    }
  }

  /**
   * Deletes an educcion
   */
  async deleteEduccion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verificar que la educción existe y pertenece a este proyecto
      const existingEduccion = await educcionService.getEduccionByCode(educod, project.id);

      if (!existingEduccion) {
        return res.status(404).json({ error: 'Educcion not found.' });
      }

      if (existingEduccion.projectId !== project.id) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // CAMBIO AQUÍ: Pasar también el project.id para identificar la educción correcta
      await educcionService.deleteEduccion(educod, project.id);

      res.status(200).json({
        message: 'Educcion deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting educcion:', err.message);
      res.status(500).json({ error: 'Error deleting educcion.' });
    }
  }

  /**
   * Searches educciones by name
   */
  async searchEduccionesByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const { name } = req.query;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const educciones = await educcionService.searchEduccionesByName(project.id, name as string);

      res.status(200).json(educciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching educciones:', err.message);
      res.status(500).json({ error: 'Error searching educciones.' });
    }
  }

  /**
   * Gets the next unique code without incrementing counter
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Cambiamos a usar getNextCodePreview en lugar de getNextCode
      const nextCode = await educcionService.getNextCodePreview(project.id);

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code preview:', err.message);
      res.status(500).json({ error: 'Error generating next code preview.' });
    }
  }

  /**
   * Gets an educcion with its ilaciones
   */
  async getEduccionWithIlaciones(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const educcionWithIlaciones = await educcionService.getEduccionWithIlaciones(educod, project.id);

      if (!educcionWithIlaciones) {
        return res.status(404).json({ error: 'Educcion not found.' });
      }

      // Verificar que la educción pertenece al proyecto correcto
      if (educcionWithIlaciones.projectId !== project.id) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      res.status(200).json(educcionWithIlaciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching educcion with ilaciones:', err.message);
      res.status(500).json({ error: 'Error fetching educcion with ilaciones.' });
    }
  }

  /**
   * Exports to Excel
   */
  async exportToExcel(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const educciones = await educcionService.getEduccionesByProject(project.id, 1, 1000);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Educciones');

      // Define headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Importance', key: 'importance', width: 15 },
        { header: 'Version', key: 'version', width: 10 },
      ];

      // Add data
      educciones.forEach(edu => {
        worksheet.addRow({
          code: edu.code,
          name: edu.name,
          description: edu.description,
          creationDate: edu.creationDate.toISOString().split('T')[0],
          status: edu.status,
          importance: edu.importance,
          version: edu.version,
        });
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };

      // Configure HTTP response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=educciones.xlsx');

      // Send file
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to Excel:', err.message);
      res.status(500).json({ error: 'Error exporting to Excel.' });
    }
  }

  /**
   * Exports to PDF
   */
  async exportToPDF(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const educciones = await educcionService.getEduccionesByProject(project.id, 1, 1000);
      // Configure HTTP response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=educciones.pdf');

      // Create PDF document
      const doc = new PDFDocument({ margin: 30 });

      // Title
      doc.fontSize(16).font('Helvetica-Bold').text('Educciones Report', { align: 'center' });
      doc.moveDown();

      // Generation info
      doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown(2);

      // Educciones table
      const headers = ['Code', 'Name', 'Status', 'Importance', 'Version'];
      const rows = educciones.map(edu => [
        edu.code,
        edu.name,
        edu.status,
        edu.importance,
        edu.version
      ]);

      // Draw table
      this.drawTable(doc, headers, rows);

      // Finalize document
      doc.end();
      doc.pipe(res);
    } catch (error) {
      const err = error as Error;
      console.error('Error exporting to PDF:', err.message);
      res.status(500).json({ error: 'Error exporting to PDF.' });
    }
  }

  /**
   * Helper function to draw tables in PDF
   */
  private drawTable(doc: PDFKit.PDFDocument, headers: string[], rows: any[][]) {
    const columnWidths = [80, 150, 80, 80, 60]; // Adjust column widths
    const tableMargin = 30; // Left margin
    const rowHeight = 20;

    let y = doc.y; // Initial Y position

    // Draw headers
    doc.fontSize(10).font('Helvetica-Bold');
    headers.forEach((header, index) => {
      const x = tableMargin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.text(header, x, y, { width: columnWidths[index], align: 'center' });
    });

    y += rowHeight;

    // Draw data rows
    doc.font('Helvetica');
    rows.forEach(row => {
      row.forEach((cell, index) => {
        const x = tableMargin + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
        doc.text(String(cell), x, y, { width: columnWidths[index], align: 'center' });
      });
      y += rowHeight;
    });
  }
}

// Export singleton instance of the controller
export const educcionController = new EduccionController();