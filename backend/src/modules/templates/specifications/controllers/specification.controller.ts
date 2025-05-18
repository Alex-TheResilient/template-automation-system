import { Request, Response } from 'express';
import { specificationService } from '../services/specification.service';
import { ilacionService } from '../../ilaciones/services/ilacion.service';
import { educcionService } from '../../educciones/services/educcion.service';
import { projectService } from '../../../projects/services/project.service';
import { SpecificationDTO } from '../models/specification.model';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class SpecificationController {
  /**
   * Creates a new specification
   */
  async createSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
      const specificationDto: SpecificationDTO = req.body;

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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Validate required fields
      if (!specificationDto.name || specificationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name is required.' });
      }

      // También deberías validar los campos obligatorios según tus requisitos
      if (!specificationDto.precondition || specificationDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition is required.' });
      }

      if (!specificationDto.procedure || specificationDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure is required.' });
      }

      if (!specificationDto.postcondition || specificationDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition is required.' });
      }

      const newSpecification = await specificationService.createSpecification(ilacion.id, specificationDto);

      res.status(201).json({
        message: 'Specification created successfully.',
        specification: newSpecification,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating specification:', err.message);
      res.status(500).json({ error: 'Error creating specification.' });
    }
  }

  /**
   * Gets all specifications from an ilacion
   */
  async getSpecificationsByIlacion(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const specifications = await specificationService.getSpecificationsByIlacion(ilacion.id, page, limit);
      res.status(200).json(specifications);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching specifications:', err.message);
      res.status(500).json({ error: 'Error fetching specifications.' });
    }
  }

  /**
   * Gets a specification by its code
   */
  async getSpecificationByCode(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;

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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const specification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!specification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      res.status(200).json(specification);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching specification:', err.message);
      res.status(500).json({ error: 'Error fetching specification.' });
    }
  }

  /**
   * Updates a specification
   */
  async updateSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;
      const specificationDto: Partial<SpecificationDTO> = req.body;

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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Verify the specification exists and belongs to this ilacion
      const existingSpecification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!existingSpecification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      if (existingSpecification.ilacionId !== ilacion.id) {
        return res.status(404).json({ error: 'Specification not found in this ilacion.' });
      }

      // Validate non-empty fields if provided
      if (specificationDto.name !== undefined && specificationDto.name.trim() === '') {
        return res.status(400).json({ error: 'Name cannot be empty.' });
      }

      if (specificationDto.precondition !== undefined && specificationDto.precondition.trim() === '') {
        return res.status(400).json({ error: 'Precondition cannot be empty.' });
      }

      if (specificationDto.procedure !== undefined && specificationDto.procedure.trim() === '') {
        return res.status(400).json({ error: 'Procedure cannot be empty.' });
      }

      if (specificationDto.postcondition !== undefined && specificationDto.postcondition.trim() === '') {
        return res.status(400).json({ error: 'Postcondition cannot be empty.' });
      }

      const updatedSpecification = await specificationService.updateSpecification(
        existingSpecification.id,
        ilacion.id,
        specificationDto,
      );

      res.status(200).json({
        message: 'Specification updated successfully.',
        specification: updatedSpecification,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating specification:', err.message);
      res.status(500).json({ error: 'Error updating specification.' });
    }
  }

  /**
   * Deletes a specification
   */
  async deleteSpecification(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod, speccod } = req.params;

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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      // Verify the specification exists and belongs to this ilacion
      const existingSpecification = await specificationService.getSpecificationByCode(speccod, ilacion.id);
      if (!existingSpecification) {
        return res.status(404).json({ error: 'Specification not found.' });
      }

      await specificationService.deleteSpecification(existingSpecification.id);

      res.status(200).json({
        message: 'Specification deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting specification:', err.message);
      res.status(500).json({ error: 'Error deleting specification.' });
    }
  }

  /**
   * Searches specifications by name
   */
  async searchSpecificationsByName(req: Request, res: Response) {
    try {
      const { orgcod, projcod, educod, ilacod } = req.params;
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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      if (!name || (name as string).trim() === '') {
        return res.status(400).json({ error: 'Name parameter is required for search.' });
      }

      const specifications = await specificationService.searchSpecificationsByName(ilacion.id, name as string);
      res.status(200).json(specifications);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching specifications:', err.message);
      res.status(500).json({ error: 'Error searching specifications.' });
    }
  }

  /**
   * Gets the next unique code
   */
  async getNextCode(req: Request, res: Response) {
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

      // Verify the ilacion belongs to this educcion
      const ilacion = await ilacionService.getIlacionByCode(ilacod, educcion.id);
      if (!ilacion) {
        return res.status(404).json({ error: 'Ilacion not found in this educcion.' });
      }

      const nextCode = await specificationService.getNextCode(ilacion.id);
      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }
}

export const specificationController = new SpecificationController();