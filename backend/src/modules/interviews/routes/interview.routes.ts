import { Router } from 'express';
import { interviewController } from '../controllers/interview.controller';

const router = Router();

// Core CRUD operations
router.post('/organizations/:orgcod/projects/:projcod/interviews', interviewController.createInterview.bind(interviewController));
router.get('/organizations/:orgcod/projects/:projcod/interviews', interviewController.getInterviewByProject.bind(interviewController));
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewId', interviewController.getInterviewById.bind(interviewController));
router.put('/organizations/:orgcod/projects/:projcod/interviews/:interviewId', interviewController.updateInterview.bind(interviewController));
router.delete('/organizations/:orgcod/projects/:projcod/interviews/:interviewId', interviewController.deleteInterview.bind(interviewController));

// Search by name
router.get('/organizations/:orgcod/projects/:projcod/interviews/search', interviewController.searchByName.bind(interviewController));

// Export the router
export default router;