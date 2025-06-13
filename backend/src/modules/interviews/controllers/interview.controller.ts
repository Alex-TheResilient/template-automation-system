// filepath: d:\PIS2_2025A\template-automation-system\backend\src\modules\interviews\controllers\interview.controller.ts
import { Request, Response } from 'express';
import { interviewService } from '../services/interview.service';
import { projectService } from '../../projects/services/project.service';
import { InterviewDTO } from '../models/interview.model';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class InterviewController {
  /**
   * Creates a new interview
   */
  async createInterview(req: Request, res: Response) {
    try {

        const { orgcod, projcod } = req.params;
            
        const interviewDto: InterviewDTO = req.body;
      
        // Verificar que el proyecto pertenece a esta organización
        const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      
        if (!project) {
          return res.status(404).json({ error: 'Project not found in this organization.' });
        }
      
        if (!interviewDto.interviewName || interviewDto.interviewName.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
        }
      
      const newInterview = await interviewService.createInterview(project.id,interviewDto);
      res.status(201).json({
        message: 'Interview created successfully.',
        interview: newInterview,
      });
    } catch (error) {
      console.error('Error creating interview:', error);
      res.status(500).json({ error: 'Error creating interview.' });
    }
  }

  /**
   * Gets all interviews for a project
   */
  async getInterviewByProject(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // CAMBIO AQUÍ: Usar project.id (UUID) en lugar de projcod
      const interviews = await interviewService.getInterviewByProject(project.id);
      res.status(200).json(interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({ error: 'Error fetching interviews.' });
    }
  }

  /**
   * Gets an interview by its ID
   */
  async getInterviewById(req: Request, res: Response) {
    try {
      const { orgcod, projcod, interviewId } = req.params;
      const id = interviewId;


      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const interview = await interviewService.getInterviewById(id,project.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found.' });
      }

      // Verificar que la entrevista pertenece al proyecto correcto
      if (interview.projectId !== project.id) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }

      res.status(200).json(interview);
    } catch (error) {
      console.error('Error fetching interview:', error);
      res.status(500).json({ error: 'Error fetching interview.' });
    }
  }

  /**
   * Updates an existing interview
   */
  async updateInterview(req: Request, res: Response) {
    try {
      const { orgcod, projcod,interviewId} = req.params;
      const id = interviewId;
      const interviewDto: InterviewDTO = req.body;
      
      // Verificar que el proyecto pertenece a esta organización
            const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);
      
            if (!project) {
              return res.status(404).json({ error: 'Project not found in this organization.' });
            }
      
            // Verificar que la entrevista existe y pertenece a este proyecto
            const existingInterview = await interviewService.getInterviewById(id, project.id);
      
            if (!existingInterview) {
              return res.status(404).json({ error: 'Interview not found.' });
            }
      
            if (existingInterview.projectId !== project.id) {
              return res.status(404).json({ error: 'Interview not found in this project.' });
            }
      
      const updatedInterview = await interviewService.updateInterview(id, interviewDto);
      res.status(200).json({
        message: 'Interview updated successfully.',
        interview: updatedInterview,
      });
    } catch (error) {
      console.error('Error updating interview:', error);
      res.status(500).json({ error: 'Error updating interview.' });
    }
  }

  /**
   * Deletes an interview
   */
  async deleteInterview(req: Request, res: Response) {
    try {
      const { orgcod, projcod, id } = req.params;
      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      // Verificar que la educción existe y pertenece a este proyecto
      const existingInterview = await interviewService.getInterviewById(id, project.id);

      if (!existingInterview) {
        return res.status(404).json({ error: 'Interview not found.' });
      }

      if (existingInterview.projectId !== project.id) {
        return res.status(404).json({ error: 'Interview not found in this project.' });
      }

      // CAMBIO AQUÍ: Pasar también el project.id para identificar la educción correcta
      await interviewService.deleteInterview(id, project.id);

      res.status(200).json({
        message: 'Interview deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting interview:', error);
      res.status(500).json({ error: 'Error deleting interview.' });
    }
  }

  /**
   * Searches for interviews by name
   */
  async searchByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod } = req.params;
      const { interviewName } = req.query;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const interviews = await interviewService.searchByName(project.id,interviewName as string);
      res.status(200).json(interviews);
    } catch (error) {
      console.error('Error searching interviews:', error);
      res.status(500).json({ error: 'Error searching interviews.' });
    }
  }

  async addAgendaItem(req: Request, res: Response) {
    const { id } = req.params;
    const { description } = req.body;
    const result = await interviewService.addAgendaItem(id, description);
    res.status(201).json(result);
  }

  async removeAgendaItem(req: Request, res: Response) {
    const { id } = req.params;
    await interviewService.removeAgendaItem(id);
    res.status(204).send();
  }

  async addConclusion(req: Request, res: Response) {
    const { id } = req.params;
    const { description } = req.body;
    const result = await interviewService.addConclusion(id, description);
    res.status(201).json(result);
  }

  async removeConclusion(req: Request, res: Response) {
    const { id } = req.params;
    await interviewService.removeConclusion(id);
    res.status(204).send();
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

      const entrevistas = await interviewService.getInterviewByProjectExport(project.id, 1, 1000);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Entrevistas');

      // Define headers
      worksheet.columns = [
        { header: 'Nombre', key: 'interviewName', width: 30 },
        { header: 'Version', key: 'version', width: 10 },
        { header: 'Fecha', key: 'creationDate', width: 20 },
       
      ];

      // Add data
      entrevistas.forEach(ent => {
        worksheet.addRow({
          interviewName: ent.interviewName,
          version: ent.version,
          interviewDate: ent.interviewDate.toISOString().split('T')[0],
        });
      });

      // Style headers
      worksheet.getRow(1).font = { bold: true };

      // Configure HTTP response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=entrevistas.xlsx');

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

      const entrevistas = await interviewService.getInterviewByProjectExport(project.id, 1, 1000);
      // Configure HTTP response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=entrevistas.pdf');

      // Create PDF document
      const doc = new PDFDocument({ margin: 30 });

      // Title
      doc.fontSize(16).font('Helvetica-Bold').text('Entrevistas Report', { align: 'center' });
      doc.moveDown();

      // Generation info
      doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown(2);

      // Educciones table
      const headers = ['Nombre', 'Version', 'Fecha'];
      const rows = entrevistas.map(int => [
        int.interviewName,
        int.version,
        int.interviewDate.toISOString().split('T')[0],
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
    const columnWidths = [80, 150, 80, 80, 150]; // Adjust column widths
    const tableMargin = 50; // Left margin
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
export const interviewController = new InterviewController();