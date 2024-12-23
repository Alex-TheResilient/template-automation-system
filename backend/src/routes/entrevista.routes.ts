import { Router } from 'express';
import * as entrevistaController from '../controllers/entrevista.controller';

const router = Router();

router.post('/projects/:projcod/entrevistas', entrevistaController.createEntrevista);
router.get('/projects/:projcod/entrevistas', entrevistaController.getEntrevistasByProyecto);
router.get('/projects/:projcod/entrevistas/:id', entrevistaController.getEntrevistaById);
router.put('/projects/:projcod/entrevistas/:id', entrevistaController.updateEntrevista);
router.delete('/projects/:projcod/entrevistas/:id', entrevistaController.deleteEntrevista);

export default router;