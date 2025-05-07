import { Request, Response } from 'express';
import { sourceService } from '../services/source.service';
import { projectService } from '../../projects/services/project.service';
import { SourceDTO } from '../models/source.model';

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
      if (!source || source.projectId !== project.id) {
        return res.status(404).json({ error: 'Source not found in this project.' });
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
      const { orgcod, projcod, srcod: srccod } = req.params;

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
      res.status(200).json({ message: 'Source deleted successfully.' });
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
}

export const sourceController = new SourceController();
