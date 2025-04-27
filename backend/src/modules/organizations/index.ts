import organizationRoutes from './routes/organization.routes';
import { organizationService } from './services/organization.service';
import { OrganizationRepository } from './repositories/organization.repository';

// Exportamos todo lo que queremos que sea accesible desde fuera del módulo
export {
  organizationRoutes,
  organizationService,
  OrganizationRepository
};