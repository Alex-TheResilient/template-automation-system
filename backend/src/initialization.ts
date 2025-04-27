// backend/src/initialization.ts
import { createAdminUser } from './services/authService';
import { organizationService } from './modules/organizations';

export const initSystem = async () => {
    try {
      await createAdminUser();
      console.log('Usuario administrador inicializado.');
  
      await organizationService.initializeMainOrganization();
      console.log('Organización principal inicializada.');
    } catch (error) {
      console.error('Error durante la inicialización del sistema:', error);
      process.exit(1); 
    }
};