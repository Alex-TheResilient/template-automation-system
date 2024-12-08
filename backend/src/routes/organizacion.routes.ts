// backend/src/routes/organizacion.routes.ts
import { Router } from 'express';
import * as organizacionController from '../controllers/organizacion.controller';

const router = Router();

// Rutas CRUD
// router.post('/', organizacionController.createOrganizacion);
// router.get('/', organizacionController.getOrganizaciones);
// router.get('/:id', organizacionController.getOrganizacionById);
// router.put('/:id', organizacionController.updateOrganizacion);
// router.delete('/:id', organizacionController.deleteOrganizacion);

// Ruta para obtener la organización principal
router.get('/principal', (req, res, next) => {
    console.log('Solicitud recibida en /api/v1/organizations/principal');
    next();
}, organizacionController.getMainOrganization);

router.get('/', organizacionController.getOrganizaciones);



export default router;
