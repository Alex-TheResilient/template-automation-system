// backend/src/routes/proyecto.routes.ts
import { Router } from 'express';
import * as proyectoController from '../controllers/proyecto.controller';

const router = Router();

// Rutas relacionadas con Proyectos
router.get('/organizations/:orgcod/projects', proyectoController.getProyectosByOrganizacion); // Listar proyectos de una organización
router.post('/organizations/:orgcod/projects', proyectoController.createProyecto); // Crear un nuevo proyecto en una organización
router.get('/organizations/:orgcod/projects/next-code', proyectoController.getNextCode); // Obtener el siguiente código único para un proyecto
router.get('/organizations/:orgcod/projects/search', proyectoController.searchProyectos); // Buscar proyectos por nombre
router.get('/organizations/:orgcod/projects/search/date', proyectoController.searchProyectosByDate); // Buscar proyectos por fecha (mes y año)
router.get('/organizations/:orgcod/projects/:projcod', proyectoController.getProyectoByOrgAndCode); // Obtener detalles de un proyecto específico
router.put('/organizations/:orgcod/projects/:projcod', proyectoController.updateProyecto); // Actualizar un proyecto específico
router.delete('/organizations/:orgcod/projects/:projcod', proyectoController.deleteProyecto); // Eliminar un proyecto específico

// Endpoint para generar el siguiente código único para un proyecto
router.get('/organizations/:orgcod/projects/next-code', proyectoController.getNextCode); // Obtener el siguiente código único para un proyecto

export default router;