import nfrRoutes from './routes/nfr.routes';
import { nfrService } from './services/nfr.service';
import { nfrRepository } from './repositories/nfr.repository';
import { nfrController } from './controllers/nfr.controller';
import { riskService } from './services/risk.service';
import { riskRepository } from './repositories/risk.repository';
import { riskController } from './controllers/risk.controller';

// Export all module components
export {
  nfrRoutes,
  nfrService,
  nfrRepository,
  nfrController,
  riskService,
  riskRepository,
  riskController
};