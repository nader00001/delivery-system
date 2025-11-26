import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

// Import des Controllers
import { AdminController } from './admin.controller';
import { ClientController } from './client.controller';
import { CatalogueCreneauxController } from './catalogue-creneaux.controller';
import { TrajectoireController } from './trajectoire.controller';
import { NotificationController } from './notification.controller';
import { ResponsableMagasinController } from './responsable-magasin.controller';
import { CamionController } from './camion.controller';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [
    AdminController,
    ClientController,
    CatalogueCreneauxController,
    CamionController,
    TrajectoireController,
    NotificationController,
    ResponsableMagasinController,
  ],
})
export class PresentationModule {}