import { Router } from 'express';
import * as organizacionController from '../controllers/organizacion.controller';

const router = Router();

// Additional Functionality
router.get('/principal', organizacionController.getMainOrganization); // Obtener la organización principal
router.get('/next-code', organizacionController.getNextCode); // Obtener el siguiente código único
router.get('/:id/proyectos', organizacionController.getOrganizacionWithProyectos); // Listar proyectos de una organización específica
router.get('/buscar-por-codigo/:orgcod', organizacionController.getOrganizacionByCodigo);

// CRUD Operations
router.post('/', organizacionController.createOrganizacion); // Crear una nueva organización
router.put('/:id', organizacionController.updateOrganizacion); // Actualizar una organización existente
router.delete('/:id', organizacionController.deleteOrganizacion); // Eliminar una organización por ID
router.get('/:id', organizacionController.getOrganizacionById); // Obtener detalles de una organización por ID
router.get('/', organizacionController.getOrganizaciones); // Listar todas las organizaciones

// Export Routes
router.get('/exports/excel', organizacionController.exportToExcel); // Exportar organizaciones a Excel
router.get('/exports/pdf', organizacionController.exportToPDF); // Exportar organizaciones a PDF

// Search
router.get('/search', organizacionController.searchOrganizaciones); // Buscar organizaciones por nombre

export default router;
