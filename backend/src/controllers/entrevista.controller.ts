import { Request, Response } from 'express';
import * as entrevistaService from '../services/entrevista.service';

export const createEntrevista = async (req: Request, res: Response) => {
  try {
    const { projcod } = req.params;
    const entrevista = await entrevistaService.createEntrevista(projcod, req.body);
    res.status(201).json(entrevista);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la entrevista' });
  }
};

export const getEntrevistasByProyecto = async (req: Request, res: Response) => {
  try {
    const { projcod } = req.params;
    const entrevistas = await entrevistaService.getEntrevistasByProyecto(projcod);
    res.status(200).json(entrevistas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las entrevistas' });
  }
};

export const getEntrevistaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entrevista = await entrevistaService.getEntrevistaById(id);
    if (entrevista) {
      res.status(200).json(entrevista);
    } else {
      res.status(404).json({ error: 'Entrevista no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la entrevista' });
  }
};

export const updateEntrevista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entrevista = await entrevistaService.updateEntrevista(id, req.body);
    res.status(200).json(entrevista);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la entrevista' });
  }
};

export const deleteEntrevista = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await entrevistaService.deleteEntrevista(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la entrevista' });
  }
};