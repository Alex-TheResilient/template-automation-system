import { Router } from 'express';
import { expertController } from '../controllers/expert.controller';

const router = Router();

router.get('/organizations/:orgcod/projects/:projcod/experts', expertController.getExpertsByProject.bind(expertController));
router.post('/organizations/:orgcod/projects/:projcod/experts', expertController.createExpert.bind(expertController));
router.get('/organizations/:orgcod/projects/:projcod/experts/next-code', expertController.getNextCode.bind(expertController));
router.get('/organizations/:orgcod/projects/:projcod/experts/search', expertController.searchExpertsByName.bind(expertController));
router.get('/organizations/:orgcod/projects/:projcod/experts/:expcod', expertController.getExpertByCode.bind(expertController));
router.put('/organizations/:orgcod/projects/:projcod/experts/:expcod', expertController.updateExpert.bind(expertController));
router.delete('/organizations/:orgcod/projects/:projcod/experts/:expcod', expertController.deleteExpert.bind(expertController));

export default router;
