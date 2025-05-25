import { Router } from 'express';
import multer from 'multer';
import { evidenceController } from '../controllers/evidence.controller';

const router = Router();
const upload = multer({ dest: 'uploads/evidence/' });

// Rutas anidadas siguiendo el patrón de educcion
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences', evidenceController.getEvidencesByInterview.bind(evidenceController));
router.post('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences', upload.single('file'), evidenceController.createEvidence.bind(evidenceController));
//router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/:code', evidenceController.getEvidenceByCode.bind(evidenceController));
router.put('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/:code', upload.single('file'), evidenceController.updateEvidence.bind(evidenceController));
router.delete('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/:code', evidenceController.deleteEvidence.bind(evidenceController));
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/search', evidenceController.searchEvidencesByName.bind(evidenceController));
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/next-code', evidenceController.getNextCode.bind(evidenceController));
router.get('/organizations/:orgcod/projects/:projcod/interviews/:interviewid/evidences/:code/preview', evidenceController.getEvidenceFilePath.bind(evidenceController));

export default router;
