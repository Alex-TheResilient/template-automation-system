// backend/src/routes/organizacion.routes.ts
import { Router } from 'express';
import * as organizacionController from '../controllers/organizacion.controller';

const router = Router();

// Ruta para obtener la organización principal
router.get('/principal', organizacionController.getMainOrganization);
router.get('/', organizacionController.getOrganizaciones);
router.get('/next-code', organizacionController.getNextCode);

// Rutas CRUD
router.post('/', organizacionController.createOrganizacion);
router.delete('/:id', organizacionController.deleteOrganizacion);
router.put('/:id', organizacionController.updateOrganizacion);
// router.get('/:id', organizacionController.getOrganizacionById);

//Busqueda
router.get('/search', organizacionController.searchOrganizaciones);




export default router;
