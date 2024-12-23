// routes/experto.routes.ts
import { Router } from 'express';
import * as expertoController from '../controllers/experto.controller';

const router = Router();

// Rutas de expertos
router.get('/proyectos/:projcod/expertos/nextCodigo', expertoController.getNextCode);  // Ruta para obtener el siguiente código de experto
router.get('/proyectos/:projcod/expertos', expertoController.getExpertosByProyecto);  // Obtener expertos por proyecto
router.get('/expertobyid', expertoController.getExpertoById);  // Obtener experto por ID
router.post('/proyectos/:projcod/expertos', expertoController.createExperto);// Crear experto
router.put('/expertos', expertoController.updateExperto);  // Actualizar experto
router.delete('/proyectos/:projcod/expertos/:expcod', expertoController.deleteExperto);  // Eliminar experto
router.get('/proyectos/:projcod/expertos/search', expertoController.searchExpertosByNombre );
router.get('/proyectos/:projcod/expertos/search/date', expertoController.searchExpertosByDate );
export default router;
