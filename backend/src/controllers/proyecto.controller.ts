// backend/src/controllers/proyecto.controller.ts
import { Request, Response } from 'express';
import * as proyectoService from '../services/proyecto.service';
import * as organizacionService from '../services/organizacion.service';

export const createProyecto = async (req: Request, res: Response) => {
    try {
        const { orgcod } = req.params;
        const { codigo, nombre, descripcion, estado, comentarios } = req.body;

        const newProyecto = await proyectoService.createProyecto(orgcod, {
            codigo,
            nombre,
            descripcion,
            estado,
            comentarios,
        });

        res.status(201).json(newProyecto);
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        res.status(500).json({ error: 'Error al crear el proyecto' });
    }
};

export const getProyectoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const proyecto = await proyectoService.getProyectoById(id);
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.status(200).json(proyecto);
    } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
};

export const updateProyecto = async (req: Request, res: Response) => {
    try {
        const { orgcod, procod } = req.params;
        const { nombre, estado, comentarios } = req.body;

        // Simula logs para depurar
        console.log(`Actualizando proyecto: orgcod=${orgcod}, procod=${procod}`);

        const organizacion = await organizacionService.getOrganizacionByCodigo(orgcod);
        if (!organizacion) {
            console.error(`Organización con código ${orgcod} no encontrada.`);
            return res.status(404).json({ error: `Organización con código ${orgcod} no encontrada.` });
        }

        const proyecto = await proyectoService.getProyectoByCodigoAndOrganizacionId(
            procod,
            organizacion.id
        );
        if (!proyecto) {
            console.error(`Proyecto con código ${procod} no encontrado en la organización ${orgcod}.`);
            return res.status(404).json({
                error: `Proyecto con código ${procod} no encontrado en la organización ${orgcod}.`,
            });
        }

        const updatedProyecto = await proyectoService.updateProyecto(proyecto.id, {
            nombre,
            estado,
            comentarios,
            fechaModificacion: new Date(),
        });

        res.status(200).json(updatedProyecto);
    } catch (err) {
        console.error('Error al actualizar el proyecto:', err);
        res.status(500).json({ error: 'Error al actualizar el proyecto.' });
    }
};

export const deleteProyecto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await proyectoService.deleteProyecto(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
};

export const getNextCode = async (req: Request, res: Response) => {
    try {
        const { orgcod } = req.params;
        const nextCode = await proyectoService.getNextCodigo(orgcod);
        res.status(200).json({ nextCode });
    } catch (error) {
        console.error('Error al obtener el siguiente código:', error);
        res.status(500).json({ error: 'Error al obtener el siguiente código' });
    }
};

export const getProyectoByOrgAndCode = async (req: Request, res: Response) => {
    try {
        const { orgcod, procod } = req.params;

        const proyecto = await proyectoService.getProyectoByOrgAndCode(orgcod, procod);

        if (!proyecto) {
            return res.status(404).json({ error: "Proyecto no encontrado." });
        }

        res.status(200).json(proyecto);
    } catch (error) {
        console.error("Error al obtener el proyecto:", error);
        res.status(500).json({ error: "Error al obtener el proyecto." });
    }
};

export const getProyectoByCodigo = async (req: Request, res: Response) => {
    try {
        const { orgcod, procod } = req.params;
        const proyecto = await proyectoService.getProyectoByCodigo(procod, orgcod);

        if (!proyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        res.status(200).json(proyecto);
    } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
};

export const getProyectosByOrganizacion = async (req: Request, res: Response) => {
    try {
        const { orgcod } = req.params;

        // Busca la organización y sus proyectos
        const proyectos = await organizacionService.getProyectosByOrganizacion(orgcod);

        if (!proyectos) {
            return res
                .status(404)
                .json({ error: `No se encontraron proyectos para la organización ${orgcod}.` });
        }

        res.status(200).json(proyectos);
    } catch (error) {
        const err = error as Error;
        console.error('Error al obtener proyectos por organización:', err.message);
        res.status(500).json({ error: 'Error al obtener los proyectos de la organización.' });
    }
};