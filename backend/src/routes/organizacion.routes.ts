// backend/src/routes/organizacion.routes.ts
import { Router } from 'express';
import * as organizacionController from '../controllers/organizacion.controller';

const router = Router();

// Additional Functionality
router.get('/principal', organizacionController.getMainOrganization); // Obtener la organización principal
router.get('/next-code', organizacionController.getNextCode); // Siguiente código único
router.get('/:orgcod', organizacionController.getOrganizacionByCodigo); // Detalles de una organización
// router.get('/:orgcod/proyectos/:procod', organizacionController.getProyectoByCodigo); // Ruta para obtener un proyecto por códigos
router.get('/:orgcod/proyectos', organizacionController.getProyectosByOrganizacion); // Obtener todos los proyectos por orgcod

// CRUD Operations
router.get('/', organizacionController.getOrganizaciones); // Listar todas las organizaciones
router.post('/', organizacionController.createOrganizacion); // Crear una nueva organización
router.put('/:orgcod', organizacionController.updateOrganizacion);
router.delete('/:id', organizacionController.deleteOrganizacion); // Eliminar una organización por ID
router.get('/:id', organizacionController.getOrganizacionById); // Obtener detalles de una organización por ID

// Export Routes
router.get('/exports/excel', organizacionController.exportToExcel); // Exportar organizaciones a Excel
router.get('/exports/pdf', organizacionController.exportToPDF); // Exportar organizaciones a PDF

// Search
router.get('/search', organizacionController.searchOrganizaciones); // Buscar organizaciones por nombre

export default router;
