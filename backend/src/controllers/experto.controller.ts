// backend/src/controllers/experto.controller.ts
import { Request, Response } from 'express';
import * as expertoService from '../services/experto.service';

// Crear un nuevo experto
export const createExperto = async (req: Request, res: Response) => {
    try {
        const { proyectoCodigo } = req.params;
        const { apellidoPaterno, apellidoMaterno, nombres, experiencia, comentario, estado } = req.body;

        const experto = await expertoService.createExperto(proyectoCodigo, {
            apellidoPaterno,
            apellidoMaterno,
            nombres,
            experiencia,
            comentario,
            estado,
        });

        res.status(201).json(experto);
    } catch (error) {const err = error as Error;
        console.error('Error al crear un experto:', err.message);
        res.status(500).json({ error: 'Error al crear un experto.' });
    }
};

// Actualizar un experto
export const updateExperto = async (req: Request, res: Response) => {
    try {
        const { proyectoCodigo, expertoCodigo } = req.params;
        const { apellidoPaterno, apellidoMaterno, nombres, experiencia, comentario, estado } = req.body;

        const experto = await expertoService.updateExperto(proyectoCodigo, expertoCodigo, {
            apellidoPaterno,
            apellidoMaterno,
            nombres,
            experiencia,
            comentario,
            estado,
        });

        if (!experto) {
            return res.status(404).json({ message: 'Experto no encontrado' });
        }

        res.json(experto);
    } catch (error) {
        const err = error as Error;
        console.error('Error al actualizar el experto:', err.message);
        res.status(500).json({ error: 'Error al actualizar el experto.' });
    }
};

// Eliminar un experto
export const deleteExperto = async (req: Request, res: Response) => {
    try {
        const { proyectoCodigo, expertoCodigo } = req.params;

        const result = await expertoService.deleteExperto(proyectoCodigo, expertoCodigo);

        if (!result) {
            return res.status(404).json({ message: 'Experto no encontrado' });
        }

        res.status(204).send(); // No content
    } catch (error) {
        const err = error as Error;
        console.error('Error al eliminar el experto:', err.message);
        res.status(500).json({ error: 'Error al eliminar el experto.' });
    }
};

// Obtener un experto por su ID
export const getExpertoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const experto = await expertoService.getExpertoById(id);

        if (!experto) {
            return res.status(404).json({ message: 'Experto no encontrado' });
        }

        res.json(experto);
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener el experto por ID:', err.message);
        res.status(500).json({ error: 'Error al obtener el experto.' });
    }
};

// Obtener un experto por el código de proyecto y código de experto
export const getExpertoByProyectoAndCode = async (req: Request, res: Response) => {
    try {
        const { proyectoCodigo, expertoCodigo } = req.params;

        const experto = await expertoService.getExpertoByProyectoAndCode(proyectoCodigo, expertoCodigo);

        if (!experto) {
            return res.status(404).json({ message: 'Experto no encontrado' });
        }

        res.json(experto);
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener el experto por código de proyecto y experto:', err.message);
        res.status(500).json({ error: 'Error al obtener el experto.' });
    }
};

// Obtener todos los expertos de un proyecto
export const getExpertosByProyecto = async (req: Request, res: Response) => {
    try {
        const { proyectoCodigo } = req.params;

        const expertos = await expertoService.getExpertosByProyecto(proyectoCodigo);

        res.json(expertos);
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener los expertos del proyecto:', err.message);
        res.status(500).json({ error: 'Error al obtener los expertos del proyecto.' });
    }
};

// Buscar expertos por nombre
export const searchExpertosByNombre = async (req: Request, res: Response) => {
    try {
        const { proyectoCodigo } = req.params;
        const { nombres } = req.query;

        const expertos = await expertoService.searchExpertosByNombre(proyectoCodigo, String(nombres));

        res.json(expertos);
    } catch (error) {
        const err = error as Error;
        console.error('Error al buscar expertos por nombre:', err.message);
        res.status(500).json({ error: 'Error al buscar expertos por nombre.' });
    }
};

// Buscar expertos por fecha
export const searchExpertosByDate = async (req: Request, res: Response) => {
    try {
        const { proyectoCodigo } = req.params;
        const { year, month } = req.query;

        const expertos = await expertoService.searchExpertosByDate(proyectoCodigo, String(year), String(month));

        res.json(expertos);
    } catch (error) {
        const err = error as Error;
        console.error('Error al buscar expertos por fecha:', err.message);
        res.status(500).json({ error: 'Error al buscar expertos por fecha.' });
    }
};


/*export const getNextCode = async (req: Request, res: Response) => {
    try {
        const { projcod } = req.params;
        const nextCode = await expertoService.getNextCodigo(projcod);
        res.status(200).json({ nextCode });
    } catch (error) {
        console.error('Error al obtener el siguiente código:', error);
        res.status(500).json({ error: 'Error al obtener el siguiente código' });
    }
};
*/
export const getNextCode = async (req: Request, res: Response) => {
    try {
        const { projcod } = req.params;  // Extracción del parámetro 'projcod' desde la URL
        const nextCode = await expertoService.getNextCodigo(projcod);  // Obtener el siguiente código
        res.status(200).json({ nextCode });  // Enviar la respuesta con el código
    } catch (error) {
        console.error('Error al obtener el siguiente código:', error);
        res.status(500).json({ error: 'Error al obtener el siguiente código' });
    }
};




