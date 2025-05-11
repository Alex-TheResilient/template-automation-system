import { Router } from 'express';
import { nfrController } from '../controllers/nfr.controller';
import { riskController } from '../controllers/risk.controller';

const router = Router();

// ============ GLOBAL ROUTES (sin filtrar por proyecto) ============

// Global NFR routes
router.get('/nfrs', nfrController.getAllNfrs.bind(nfrController));
router.get('/nfrs/exports/excel', nfrController.exportAllToExcel.bind(nfrController));
router.get('/nfrs/frequent', nfrController.getFrequentNfrs.bind(nfrController));
router.get('/nfrs/:nfrcod', nfrController.getNfrByCode.bind(nfrController));
router.get('/nfrs/:nfrcod/instances', nfrController.getNfrInstances.bind(nfrController));

// Global Risk routes
router.get('/risks', riskController.getAllRisks.bind(riskController));
router.get('/risks/exports/excel', riskController.exportAllToExcel.bind(riskController));
router.get('/risks/similar', riskController.getSimilarRisks.bind(riskController));
router.get('/risks/frequent', riskController.getFrequentRisks.bind(riskController));
router.get('/risks/:riskcod', riskController.getRiskByCode.bind(riskController));
router.get('/risks/entity/:entityType/registry/:registryCode', riskController.getRisksByEntityAndRegistry.bind(riskController));

// ============ PROJECT-SPECIFIC ROUTES ============

// NFR routes - siguiendo el patrón de proyectos
// Core CRUD operations (collection routes)
router.get('/projects/:projcod/nfrs', nfrController.getNfrsByProject.bind(nfrController));
router.post('/projects/:projcod/nfrs', nfrController.createNfr.bind(nfrController));
router.post('/projects/:projcod/nfrs/from-existing', nfrController.createNfrFromExisting.bind(nfrController));
router.get('/projects/:projcod/nfrs/check-duplicate', nfrController.checkDuplicateNfr.bind(nfrController));

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
router.post('/projects/:projcod/risks/from-existing', riskController.createRiskFromExisting.bind(riskController));
router.get('/projects/:projcod/risks/check-duplicate', riskController.checkDuplicateRisk.bind(riskController));

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