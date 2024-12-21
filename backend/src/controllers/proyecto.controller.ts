// backend/src/controllers/proyecto.controller.ts
import { Request, Response } from 'express';
import * as proyectoService from '../services/proyecto.service';

// Crear un nuevo proyecto
export const createProyecto = async (req: Request, res: Response) => {
    try {
        const { orgcod } = req.params;
        const { nombre, descripcion, estado, comentarios } = req.body;

        const newProyecto = await proyectoService.createProyecto(orgcod, {
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

// Obtener un proyecto por ID
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

// Actualizar un proyecto
export const updateProyecto = async (req: Request, res: Response) => {
    const { orgcod, projcod } = req.params;
    const data = req.body;

    try {
        const proyectoActualizado = await proyectoService.updateProyecto(orgcod, projcod, data);
        res.status(200).json({
            message: 'Proyecto actualizado con éxito.',
            proyecto: proyectoActualizado,
        });
    } catch (err) {
        console.error('Error al actualizar proyecto:', err);
        res.status(500).json({ error: 'Error al actualizar el proyecto.' });
    }
};

// Eliminar un proyecto
export const deleteProyecto = async (req: Request, res: Response) => {
    const { orgcod, projcod } = req.params;

    try {
        const result = await proyectoService.deleteProyecto(orgcod, projcod);
        res.status(200).json({ message: 'Proyecto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
};

// Obtener el siguiente código único para un proyecto
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

// Obtener detalles de un proyecto específico
export const getProyectoByOrgAndCode = async (req: Request, res: Response) => {
    const { orgcod, projcod } = req.params;

    try {
        const proyecto = await proyectoService.getProyectoByOrgAndCode(orgcod, projcod);
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
        res.status(200).json(proyecto);
    } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
};

// Obtener todos los proyectos de una organización
export const getProyectosByOrganizacion = async (req: Request, res: Response) => {
    const { orgcod } = req.params;

    try {
        const proyectos = await proyectoService.getProyectosByOrganizacion(orgcod);
        res.status(200).json(proyectos);
    } catch (err) {
        console.error('Error al obtener los proyectos:', err);
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};

// Buscar proyectos
export const searchProyectos = async (req: Request, res: Response) => {
    try{
        const {orgcod} = req.params;
        const {nombre} = req.query;

        if(typeof nombre !== 'string'){
            return res.status(400).json({error: 'Parámetros inválidos'});
        }
        const proyectos = await proyectoService.searchProyectosByNombre(orgcod, nombre);
        res.status(200).json(proyectos);   
    }
    catch (error){
        console.error('Error al buscar proyectos:', error);
        res.status(500).json({ error: 'Error al buscar proyectos' });
    }
};