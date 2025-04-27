import { Router } from 'express';
import { organizationController } from '../controllers/organization.controller';

const router = Router();

// Funcionalidad adicional
router.get('/main', organizationController.getMainOrganization);
router.get('/next-code', organizationController.getNextCode);

// Rutas de búsqueda
router.get('/search', organizationController.searchOrganizations);
router.get('/search/date', organizationController.searchOrganizationsByDate);

// Rutas de exportación
router.get('/exports/excel', organizationController.exportToExcel);
router.get('/exports/pdf', organizationController.exportToPDF);

// Operaciones CRUD
router.get('/', organizationController.getOrganizations);
router.post('/', organizationController.createOrganization);
router.get('/:code', organizationController.getOrganizationByCode);
router.put('/:code', organizationController.updateOrganization);
router.delete('/:id', organizationController.deleteOrganization);
router.get('/:code/projects', organizationController.getProjectsByOrganization);

export default router;