import { Router } from 'express';
import { organizationController } from '../controllers/organization.controller';

const router = Router();

// Funcionalidad adicional
router.get('/organizations/main', organizationController.getMainOrganization);
router.get('/organizations/next-code', organizationController.getNextCode);

// Rutas de búsqueda
router.get('/organizations/search', organizationController.searchOrganizations);
router.get('/organizations/search/date', organizationController.searchOrganizationsByDate);

// Rutas de exportación
router.get('/organizations/exports/excel', organizationController.exportToExcel);
router.get('/organizations/exports/pdf', organizationController.exportToPDF);

// Operaciones CRUD
router.get('/organizations/', organizationController.getOrganizations);
router.post('/organizations/', organizationController.createOrganization);
router.get('/organizations/:code', organizationController.getOrganizationByCode);
router.put('/organizations/:code', organizationController.updateOrganization);
router.delete('/organizations/:id', organizationController.deleteOrganization);
router.get('/organizations/:code/projects', organizationController.getProjectsByOrganization);

export default router;