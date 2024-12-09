// backend/src/controllers/proyecto.controller.ts

import { Request, Response } from 'express';
import * as proyectoService from '../services/proyecto.service';

export const createProyecto = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newProyecto = await proyectoService.createProyecto(data);
        res.status(201).json(newProyecto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el proyecto' });
    }
};

export const getProyectos = async (req: Request, res: Response) => {
    try {
      const { organizacionCodigo } = req.query;
  
      if (!organizacionCodigo) {
        return res.status(400).json({ error: "El código de la organización es requerido" });
      }
  
      const proyectos = await proyectoService.getProyectosByOrganizacionCodigo(organizacionCodigo as string);
      res.status(200).json(proyectos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los proyectos" });
    }
  };
  
export const getProyectoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const proyecto = await proyectoService.getProyectoById(id);
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
};

export const updateProyecto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatePproyecto = await proyectoService.updateProyecto(id, data);
        res.status(200).json(updatePproyecto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proyecto' });
    }
};

export const deleteProyecto = async (req: Request, res: Response) => {
    try {
        await proyectoService.deleteProyecto(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
};

export const getNextCode = async (_req: Request, res: Response) => {
    try {
        const nextCode = await proyectoService.getNextCodigo();
        res.status(200).json({ nextCode });
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener el siguiente código:', err.message);
        res.status(500).json({ error: 'Error al obtener el siguiente código.' });
    }
};
