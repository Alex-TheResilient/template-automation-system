// backend/src/routes/proyecto.routes.ts
import { Router } from 'express';
import * as proyectoController from '../controllers/proyecto.controller';

const router = Router();

router.get('/organizations/:orgcod/projects', proyectoController.getProyectosByOrganizacion); // Listar proyectos

// CRUD de Proyectos
router.post('/organizations/:orgcod/projects', proyectoController.createProyecto); // Crear proyecto
router.get('/organizations/:orgcod/projects/:projcod', proyectoController.getProyectoByOrgAndCode); // Detalles de proyecto
router.put('/organizations/:orgcod/projects/:projcod', proyectoController.updateProyecto); // Actualizar proyecto
router.delete('/organizations/:orgcod/projects/:projcod', proyectoController.deleteProyecto); // Eliminar proyecto

// Otros endpoints
router.get('/organizations/:orgcod/next-code', proyectoController.getNextCode);
// router.get('/organizations/:orgcod/proyectos, royectoController.getProyectosByOrganizacion);

export default router;
