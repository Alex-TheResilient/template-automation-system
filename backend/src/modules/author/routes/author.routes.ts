// routes/author.routes.ts - Versión final con endpoints de organizaciones
import { Router } from 'express';
import { authorController } from '../controllers/author.controller';

const router = Router();

// Core CRUD operations
router.get('/authors', authorController.getAuthors.bind(authorController));
router.post('/authors', authorController.createAuthor.bind(authorController));

// Specific routes must be placed before routes with variable parameters!
router.get('/authors/next-code', authorController.getNextCode.bind(authorController));
router.get('/authors/search', authorController.searchAuthors.bind(authorController));
router.get('/authors/stats', authorController.getAuthorStats.bind(authorController));

// NEW: Organization and template author endpoints
router.get('/authors/organizations', authorController.getOrganizationOptions.bind(authorController));
router.get('/authors/template-authors', authorController.getTemplateAuthorOptions.bind(authorController));
router.get('/authors/copy-permissions/:templateAuthorId', authorController.copyPermissionsFromTemplate.bind(authorController));

// NEW: Permission-based endpoints
router.get('/authors/by-permission/:permission', authorController.getAuthorsByPermission.bind(authorController));
router.post('/authors/bulk-update-permissions', authorController.bulkUpdatePermissions.bind(authorController));

// Status specific routes
router.get('/authors/status/:status', authorController.getAuthorsByStatus.bind(authorController));

// Role specific routes
router.get('/authors/role/:roleId', authorController.getAuthorsByRole.bind(authorController));

// Routes with variable parameters after specific routes
router.get('/authors/:id', authorController.getAuthorById.bind(authorController));
router.put('/authors/:id', authorController.updateAuthor.bind(authorController));
router.delete('/authors/:id', authorController.deleteAuthor.bind(authorController));

// NEW: Version history
router.get('/authors/:id/version-history', authorController.getVersionHistory.bind(authorController));

// Action routes with ID
router.put('/authors/:id/activate', authorController.activateAuthor.bind(authorController));
router.put('/authors/:id/deactivate', authorController.deactivateAuthor.bind(authorController));

// Routes by code (alternative access)
router.get('/authors/code/:code', authorController.getAuthorByCode.bind(authorController));

export default router;