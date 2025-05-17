import { Request, Response } from 'express';
import { ilacionService } from '../services/ilacion.service';
import { educcionService } from '../../educciones/services/educcion.service';
import { projectService } from '../../../projects/services/project.service';
import { IlacionDTO } from '../models/ilacion.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class IlacionController {
  /**
   * Creates a new ilacion
   */
  async createIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;
      const ilacionDto: IlacionDTO = req.body;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Validar campos obligatorios
      if (!ilacionDto.name || ilacionDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      if (!ilacionDto.precondition || ilacionDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition is required.' });
      }

      if (!ilacionDto.procedure || ilacionDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure is required.' });
      }

      if (!ilacionDto.postcondition || ilacionDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition is required.' });
      }

      const newIlacion = await ilacionService.createIlacion(educcion.id, ilacionDto);

      res.status(201).json({
        message: 'Ilacion created successfully.',
        ilacion: newIlacion,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating ilacion:', err);
      return res.status(500).json({ error: `Error creating ilacion: ${err.message}` });
    }
  }

  /**
   * Gets all ilaciones from an educcion
   */
  async getIlacionesByEduccion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const ilaciones = await ilacionService.getIlacionesByEduccion(educcion.id, page, limit);
      res.status(200).json(ilaciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching ilaciones:', err.message);
      res.status(500).json({ error: 'Error fetching ilaciones.' });
    }
  }

  /**
   * Gets an ilacion by its code
   */
  async getIlacionByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found.' });
      }

      // Verify the ilacion belongs to the correct educcion
      if (ilacion.educcionId !== educcion.id) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      res.status(200).json(ilacion);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching ilacion:', err.message);
      res.status(500).json({ error: 'Error fetching ilacion.' });
    }
  }

  /**
   * Updates an ilacion
   */
  async updateIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
      const ilacionDto: IlacionDTO = req.body;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion exists and belongs to this educcion
      const existingIlacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!existingIlacion) {
        return res.status(404).json({ error: 'Ilacion not found.' });
      }

      if (existingIlacion.educcionId !== educcion.id) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Validar campos obligatorios
      if (ilacionDto.name !== undefined && ilacionDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name cannot be empty.' });
      }

      if (ilacionDto.precondition !== undefined && ilacionDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition cannot be empty.' });
      }

      if (ilacionDto.procedure !== undefined && ilacionDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure cannot be empty.' });
      }

      if (ilacionDto.postcondition !== undefined && ilacionDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition cannot be empty.' });
      }

      const updatedIlacion = await ilacionService.updateIlacion(ilacod, ilacionDto);

      res.status(200).json({
        message: 'Ilacion updated successfully.',
        ilacion: updatedIlacion,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating ilacion:', err.message);
      res.status(500).json({ error: 'Error updating ilacion.' });
    }
  }

  /**
   * Deletes an ilacion
   */
  async deleteIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      // Verify the ilacion exists and belongs to this educcion
      const existingIlacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!existingIlacion) {
        return res.status(404).json({ error: 'Ilacion not found.' });
      }

      if (existingIlacion.educcionId !== educcion.id) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      await ilacionService.deleteIlacion(ilacod, educcion.id);

      res.status(200).json({
        message: 'Ilacion deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting ilacion:', err.message);
      res.status(500).json({ error: 'Error deleting ilacion.' });
    }
  }

  /**
   * Searches ilaciones by name
   */
  async searchIlacionesByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;
      const { name } = req.query;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const ilaciones = await ilacionService.searchIlacionesByName(educcion.id, name as string);
      res.status(200).json(ilaciones);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching ilaciones:', err.message);
      res.status(500).json({ error: 'Error searching ilaciones.' });
    }
  }

  /**
   * Gets the next unique code
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const nextCode = await ilacionService.getNextCode(educcion.id);
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
      const { orgcod, projcod, educod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const ilaciones = await ilacionService.getIlacionesByEduccion(educcion.id, 1, 1000);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Ilaciones');

      // Define headers
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 15 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Importance', key: 'importance', width: 15 }, // Cambiado de priority a importance
        { header: 'Precondition', key: 'precondition', width: 25 }, // Nuevo campo
        { header: 'Procedure', key: 'procedure', width: 30 }, // Nuevo campo
        { header: 'Postcondition', key: 'postcondition', width: 25 }, // Nuevo campo
        { header: 'Version', key: 'version', width: 10 },
      ];


      // Add data
      ilaciones.forEach(ila => {
        worksheet.addRow({
          code: ila.code,
          name: ila.name,
          creationDate: ila.creationDate.toISOString().split('T')[0],
          status: ila.status,
          importance: ila.importance, // Cambiado de priority a importance
          precondition: ila.precondition,
          procedure: ila.procedure,
          postcondition: ila.postcondition,
          version: ila.version,
        });
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };

      // Configure HTTP response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=ilaciones.xlsx');

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
      const { orgcod, projcod, educod } = req.params;

      // Verify the project belongs to this organization
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verify the educcion belongs to this project
      const educcion = await educcionService.getEduccionByCode(educod, project.id);
      if (!educcion) {
        return res.status(404).json({ error: 'Educcion not found in this project.' });
      }

      const ilaciones = await ilacionService.getIlacionesByEduccion(educcion.id, 1, 1000);

      // Configure HTTP response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=ilaciones.pdf');

      // Create PDF document
      const doc = new PDFDocument({ margin: 30 });

      // Title
      doc.fontSize(16).font('Helvetica-Bold').text('Ilaciones Report', { align: 'center' });
      doc.moveDown();

      // Generation info
      doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown(2);

      // Ilaciones table
      const headers = ['Code', 'Name', 'Status', 'Priority', 'Version'];
      const rows = ilaciones.map(ila => [
        ila.code,
        ila.name,
        ila.status,
        ila.importance,
        ila.version
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
    const tableTop = 150;
    const rowHeight = 20;
    const tableWidth = 500;
    const colWidth = tableWidth / headers.length;

    // Draw headers
    doc.font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, 30 + (i * colWidth), tableTop);
    });

    // Draw rows
    doc.font('Helvetica');
    rows.forEach((row, rowIndex) => {
      const y = tableTop + ((rowIndex + 1) * rowHeight);

      row.forEach((cell, colIndex) => {
        doc.text(String(cell), 30 + (colIndex * colWidth), y);
      });
    });
  }
}

export const ilacionController = new IlacionController();