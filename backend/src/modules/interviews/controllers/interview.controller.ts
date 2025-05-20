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
      const { orgcod, projcod, id } = req.params;

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
      const { name } = req.query;

      // Verificar que el proyecto pertenece a esta organización
      const project = await projectService.getProjectByOrgAndCode(orgcod, projcod);

      if (!project) {
        return res.status(404).json({ error: 'Project not found in this organization.' });
      }

      const interviews = await interviewService.searchByName(name as string, project.id);
      res.status(200).json(interviews);
    } catch (error) {
      console.error('Error searching interviews:', error);
      res.status(500).json({ error: 'Error searching interviews.' });
    }
  }


}


// Export singleton instance of the controller
export const interviewController = new InterviewController();