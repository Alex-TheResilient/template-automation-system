import { Router } from 'express';
import { nfrController } from '../controllers/nfr.controller';
import { riskController } from '../controllers/risk.controller';

const router = Router();

// NFR routes - siguiendo el patrón de proyectos
// Core CRUD operations (collection routes)
router.get('/projects/:projcod/nfrs', nfrController.getNfrsByProject.bind(nfrController));
router.post('/projects/:projcod/nfrs', nfrController.createNfr.bind(nfrController));

// Additional functionality
router.get('/projects/:projcod/nfrs/next-code', nfrController.getNextCode.bind(nfrController));

// Search routes
router.get('/projects/:projcod/nfrs/search/name', nfrController.searchNfrs.bind(nfrController));
router.get('/projects/:projcod/nfrs/search/date', nfrController.searchNfrsByDate.bind(nfrController));
router.get('/projects/:projcod/nfrs/search/status', nfrController.searchNfrsByStatus.bind(nfrController));
router.get('/projects/:projcod/nfrs/search/quality-attribute', nfrController.searchNfrsByQualityAttribute.bind(nfrController));

// Export routes
router.get('/projects/:projcod/nfrs/exports/excel', nfrController.exportToExcel.bind(nfrController));
router.get('/projects/:projcod/nfrs/exports/pdf', nfrController.exportToPDF.bind(nfrController));

// Core CRUD operations (individual resources)
router.get('/projects/:projcod/nfrs/:nfrcod', nfrController.getNfrByCode.bind(nfrController));
router.put('/projects/:projcod/nfrs/:nfrcod', nfrController.updateNfr.bind(nfrController));
router.delete('/projects/:projcod/nfrs/:nfrcod', nfrController.deleteNfr.bind(nfrController));

// Risk routes - siguiendo el patrón de proyectos
// Collection routes for risks
router.get('/projects/:projcod/risks', riskController.getRisksByProject.bind(riskController));
router.post('/projects/:projcod/risks', riskController.createRisk.bind(riskController));

// Risk for specific NFR
router.get('/projects/:projcod/nfrs/:nfrcod/risks', riskController.getRisksByNfr.bind(riskController));
router.post('/projects/:projcod/nfrs/:nfrcod/risks', riskController.createRiskForNfr.bind(riskController));

// Additional functionality
router.get('/projects/:projcod/risks/next-code', riskController.getNextCode.bind(riskController));

// Search routes
router.get('/projects/:projcod/risks/search/status', riskController.searchRisksByStatus.bind(riskController));
router.get('/projects/:projcod/risks/search/date', riskController.searchRisksByDate.bind(riskController));

// Export routes
router.get('/projects/:projcod/risks/exports/excel', riskController.exportToExcel.bind(riskController));
router.get('/projects/:projcod/risks/exports/pdf', riskController.exportToPDF.bind(riskController));

// Individual risk routes
router.get('/projects/:projcod/risks/:riskcod', riskController.getRiskByCode.bind(riskController));
router.put('/projects/:projcod/risks/:riskcod', riskController.updateRisk.bind(riskController));
router.delete('/projects/:projcod/risks/:riskcod', riskController.deleteRisk.bind(riskController));

export default router;