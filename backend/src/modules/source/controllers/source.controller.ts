import { Request, Response } from 'express';
import { sourceService } from '../services/source.service';
import { projectService } from '../../projects/services/project.service';
import { SourceDTO } from '../models/source.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class SourceController {

  async createSource(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const sourceDto: SourceDTO = req.body;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      if (!sourceDto.name || sourceDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      const newSource = await sourceService.createSource(project.id, sourceDto);
      res.status(201).json({
        message: 'Source created successfully.',
        source: newSource,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating source:', err.message);
      res.status(500).json({ error: 'Error creating source.' });
    }
  }

  async getSourcesByProject(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const sources = await sourceService.getSourcesByProject(project.id, page, limit);
      res.status(200).json(sources);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching sources:', err.message);
      res.status(500).json({ error: 'Error fetching sources.' });
    }
  }

  async getSourceByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, srccod } = req.params;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }
      
      const source = await sourceService.getSourceByCode(srccod, project.id);
      
      if (!source) {
        return res.status(404).json({ error: 'Source  not found.' });
      }

      // Verificar que la educción pertenece al proyecto correcto
      if (source.projectId !== project.id) {
        return res.status(404).json({ error: 'Source  not found in this project.' });
      }

      res.status(200).json(source);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching source:', err.message);
      res.status(500).json({ error: 'Error fetching source.' });
    }
  }

  async updateSource(req: Request, res: Response) {
    try {
      const { orgcod, projcod, srccod } = req.params;
      const sourceDto: SourceDTO = req.body;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const existingSource = await sourceService.getSourceByCode(srccod, project.id);
      if (!existingSource ) {
        return res.status(404).json({ error: 'Source not found ' });
      }

     if(existingSource.projectId !== project.id){
        return res.status(404).json({ error: 'Source not found in this project.' });
      }
     

      const updatedSource = await sourceService.updateSource(srccod, sourceDto);
      res.status(200).json({
        message: 'Source updated successfully.',
        source: updatedSource,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating source:', err.message);
      res.status(500).json({ error: 'Error updating source.' });
    }
  }

  async deleteSource(req: Request, res: Response) {
    try {
      const { orgcod, projcod, srccod } = req.params;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const existingSource = await sourceService.getSourceByCode(srccod, project.id);
      if (!existingSource) {
        return res.status(404).json({ error: 'Source not found.' });
      }
      if (existingSource.projectId !== project.id) {
        return res.status(404).json({ error: 'Source not found in this project.' });
      }

      await sourceService.deleteSource(srccod, project.id);
      res.status(200).json({ 
        message: 'Source deleted successfully.' });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting source:', err.message);
      res.status(500).json({ error: 'Error deleting source.' });
    }
  }

  async searchSourcesByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const { name } = req.query;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const sources = await sourceService.searchSourcesByName(project.id, name as string);
      res.status(200).json(sources);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching source:', err.message);
      res.status(500).json({ error: 'Error searching source.' });
    }
  }

  async getNextCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;

      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const nextCode = await sourceService.getNextCode(project.id);
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

      const expertos = await sourceService.getSourcesByProject(project.id, 1, 1000);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Educciones');

      // Define headers
      worksheet.columns = [
        { header: 'Codigo', key: 'code', width: 15 },
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Creation Date', key: 'creationDate', width: 20 },
        { header: 'Modification Date', key: 'modificationDate', width: 20 },
        { header: 'status', key: 'status', width: 10 },

       
      ];

      // Add data
      expertos.forEach(fue => {
        worksheet.addRow({
          code: fue.code,
          name: fue.name,
          creationDate: fue.creationDate.toISOString().split('T')[0],
          modificationDate: fue.modificationDate ? fue.modificationDate.toISOString().split('T')[0] : 'N/A',
          status: fue.status,
                 
        });
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };

      // Configure HTTP response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=fuentes.xlsx');

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

      const expertos = await sourceService.getSourcesByProject(project.id, 1, 1000);
      // Configure HTTP response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=fuentes.pdf');

      // Create PDF document
      const doc = new PDFDocument({ margin: 30 });

      // Title
      doc.fontSize(16).font('Helvetica-Bold').text('Fuentes Report', { align: 'center' });
      doc.moveDown();

      // Generation info
      doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown(2);

      // Fuente table
      const headers = ['Code', 'Name', 'Creation Date',  'Modification Date', 'Status'];
      const rows = expertos.map(fue => [
        fue.code,
        fue.name,
        fue.creationDate.toISOString().split('T')[0],
        fue.modificationDate ? fue.modificationDate.toISOString().split('T')[0] : 'N/A',
        fue.status,
        
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
    const columnWidths = [80, 150, 100, 100, 60]; // Adjust column widths
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

export const sourceController = new SourceController();
