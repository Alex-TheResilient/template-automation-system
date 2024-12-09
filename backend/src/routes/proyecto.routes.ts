// backend/src/routes/proyecto.routes.ts
import express from 'express';
import * as proyectoController from '../controllers/proyecto.controller';

const router = express.Router();

router.get('/', proyectoController.getProyectos); // Leer todos los proyectos
router.get('/next-code', proyectoController.getNextCode);
router.post('/', proyectoController.createProyecto); // Crear un proyecto
router.put('/:id', proyectoController.updateProyecto); // Actualizar un proyecto
router.delete('/:id', proyectoController.deleteProyecto); // Eliminar un proyecto
router.get('/:id', proyectoController.getProyectoById); // Leer un proyecto por ID

export default router;
