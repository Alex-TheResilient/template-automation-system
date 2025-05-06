
import { Request, Response } from 'express';
import { expertService } from '../services/expert.service';
import { projectService } from '../../projects/services/project.service';
import { ExpertDTO } from '../models/expert.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class ExpertController {

  async createExpert(req: Request, res: Response) {

    try {
          const { orgcod, projcod } = req.params;
          const expertDto: ExpertDTO = req.body;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          if (!expertDto.firstName || expertDto.firstName.trim() === '') {
            return res.status(400).json({ error: 'firstName is required.' });
          }
    
          const newExpert = await expertService.createExpert(project.id, expertDto);
    
          res.status(201).json({
            message: 'Expert created successfully.',
            Experto: newExpert,
          });
        } catch (error) {
          const err = error as Error;
          console.error('Error completo:', err);
          return res.status(500).json({ error: `Error creating expert: ${err.message}` });
        }
      
  }

  async getExpertsByProject(req: Request, res: Response) {

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
          const expertos = await expertService.getExpertsByProject(project.id, page, limit);
    
          res.status(200).json(expertos);
        } catch (error) {
          const err = error as Error;
          console.error('Error fetching expertos:', err.message);
          res.status(500).json({ error: 'Error fetching expertos.' });
        }
  }

  async getExpertByCode(req: Request, res: Response) {

    try {
          const { orgcod, projcod, expcod } = req.params;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          const experto = await expertService.getExpertByCode(expcod, project.id);
    
          if (!experto) {
            return res.status(404).json({ error: 'Experto not found.' });
          }
    
          // Verificar que el experto pertenece al proyecto correcto
          if (experto.projectId !== project.id) {
            return res.status(404).json({ error: 'Experto not found in this project.' });
          }
    
          res.status(200).json(experto);
        } catch (error) {
          const err = error as Error;
          console.error('Error fetching experto:', err.message);
          res.status(500).json({ error: 'Error fetching experto.' });
        }
  }

  async updateExpert(req: Request, res: Response) {

    try {
          const { orgcod, projcod, educod: expcod } = req.params;
          const expertDto: ExpertDTO = req.body;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          // Verificar que el experto existe y pertenece a este proyecto
          const existingExperto = await expertService.getExpertByCode(expcod, project.id);
    
          if (!existingExperto) {
            return res.status(404).json({ error: 'Experto not found.' });
          }
    
          if (existingExperto.projectId !== project.id) {
            return res.status(404).json({ error: 'Experto not found in this project.' });
          }
    
          const updatedEduccion = await expertService.updateExpert(expcod, expertDto);
    
          res.status(200).json({
            message: 'Experto updated successfully.',
            educcion: updatedEduccion,
          });
        } catch (error) {
          const err = error as Error;
          console.error('Error updating experto:', err.message);
          res.status(500).json({ error: 'Error updating experto.' });
        }

  }

  async deleteExpert(req: Request, res: Response) {
    try {
          const { orgcod, projcod, expcod: expcod } = req.params;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          // Verificar que el experto existe y pertenece a este proyecto
          const existingEduccion = await expertService.getExpertByCode(expcod, project.id);
    
          if (!existingEduccion) {
            return res.status(404).json({ error: 'Experto not found.' });
          }
    
          if (existingEduccion.projectId !== project.id) {
            return res.status(404).json({ error: 'Experto not found in this project.' });
          }
    
          // CAMBIO AQUÍ: Pasar también el project.id para identificar al experto correcta
          await expertService.deleteExpert(expcod, project.id);
    
          res.status(200).json({
            message: 'Experto deleted successfully.',
          });
        } catch (error) {
          const err = error as Error;
          console.error('Error deleting experto:', err.message);
          res.status(500).json({ error: 'Error deleting experto.' });
        }
  }

  async searchExpertsByName(req: Request, res: Response) {
    try {
          const { orgcod, projcod } = req.params;
          const { firstName } = req.query;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          if (!firstName || (firstName as string).trim() === '') {
            return res.status(400).json({ error: 'firstName parameter is required for search.' });
          }
    
          const expertos = await expertService.searchExpertsByName(project.id, firstName as string);
    
          res.status(200).json(expertos);
        } catch (error) {
          const err = error as Error;
          console.error('Error searching experto:', err.message);
          res.status(500).json({ error: 'Error searching experto.' });
        }
  }

  async getNextCode(req: Request, res: Response) {
    try {
          const { orgcod, projcod } = req.params;
    
          // Verificar que el proyecto pertenece a esta organización
          const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
    
          if (!project) {
            return res.status(404).json({ error: 'Project not found in this organization.' });
          }
    
          const nextCode = await expertService.getNextCode(project.id);
    
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
    try {
      const { orgcod, projcod } = req.params;
      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const expertos = await expertService.getExpertsByProject(project.id, 1, 1000);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Educciones');

      // Define headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Experiencia', key: 'experience', width: 15 },
       
      ];

      // Add data
      expertos.forEach(exp => {
        worksheet.addRow({
          code: exp.code,
          name: exp.firstName,
          creationDate: exp.creationDate.toISOString().split('T')[0],
          version: exp.version,
          experience: exp.experience,
                 
        });
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };

      // Configure HTTP response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=expertos.xlsx');

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

      const expertos = await expertService.getExpertsByProject(project.id, 1, 1000);
      // Configure HTTP response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=expertos.pdf');

      // Create PDF document
      const doc = new PDFDocument({ margin: 30 });

      // Title
      doc.fontSize(16).font('Helvetica-Bold').text('Expertos Report', { align: 'center' });
      doc.moveDown();

      // Generation info
      doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown(2);

      // Educciones table
      const headers = ['Code', 'FirstName', 'Date',  'Version', 'Experience'];
      const rows = expertos.map(edu => [
        edu.code,
        edu.firstName,
        edu.creationDate,
        edu.version,
        edu.experience
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

export const expertController = new ExpertController();
