import { Router } from 'express';
import { projectController } from '../controllers/project.controller';

const router = Router();

// Project routes
router.get('/organizations/:orgcod/projects', projectController.getProjectsByOrganization.bind(projectController));
router.post('/organizations/:orgcod/projects', projectController.createProject.bind(projectController));
router.get('/organizations/:orgcod/projects/next-code', projectController.getNextCode.bind(projectController));
router.get('/organizations/:orgcod/projects/search', projectController.searchProjects.bind(projectController));
router.get('/organizations/:orgcod/projects/search/date', projectController.searchProjectsByDate.bind(projectController));
router.get('/organizations/:orgcod/projects/:projcod', projectController.getProjectByOrgAndCode.bind(projectController));
router.put('/organizations/:orgcod/projects/:projcod', projectController.updateProject.bind(projectController));
router.delete('/organizations/:orgcod/projects/:projcod', projectController.deleteProject.bind(projectController));

// Export routes
router.get('/organizations/:orgcod/projects/exports/excel', projectController.exportToExcel.bind(projectController));
router.get('/organizations/:orgcod/projects/exports/pdf', projectController.exportToPDF.bind(projectController));

export default router;