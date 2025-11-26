import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import des entités TypeORM
import { AdminTypeORM } from './database/admin.orm.entity';
import { ClientTypeORM } from './database/client.orm.entity';
import { CatalogueCreneauxTypeORM } from './database/catalogue-creneaux.orm.entity';
import { CamionTypeORM } from './database/camion.orm.entity';
import { TrajectoireTypeORM } from './database/trajectoire.orm.entity';
import { NotificationTypeORM } from './database/notification.orm.entity';
import { ResponsableMagasinTypeORM } from './database/responsable-magasin.orm.entity';

// Import des repositories
import { AdminRepository } from './repositories/admin.repository';
import { ClientRepository } from './repositories/client.repository';
import { CatalogueCreneauxRepository } from './repositories/catalogue-creneaux.repository';
import { CamionRepository } from './repositories/camion.repository';
import { TrajectoireRepository } from './repositories/trajectoire.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { ResponsableMagasinRepository } from './repositories/responsable-magasin.repository';

// Import des services
import { AdminService } from './services/admin.service';
import { ClientService } from './services/client.service';
import { CatalogueCreneauxService } from './services/catalogue-creneaux.service';
import { CamionService } from './services/camion.service';
import { TrajectoireService } from './services/trajectoire.service';
import { NotificationService } from './services/notification.service';
import { ResponsableMagasinService } from './services/responsable-magasin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminTypeORM,
      ClientTypeORM,
      CatalogueCreneauxTypeORM,
      CamionTypeORM,
      TrajectoireTypeORM,
      NotificationTypeORM,
      ResponsableMagasinTypeORM,
    ]),
  ],
  providers: [
    // Repositories avec leurs tokens d'interface
    {
      provide: 'IAdminRepository',
      useClass: AdminRepository,
    },
    {
      provide: 'IClientRepository',
      useClass: ClientRepository,
    },
    {
      provide: 'ICatalogueCreneauxRepository',
      useClass: CatalogueCreneauxRepository,
    },
    {
      provide: 'ICamionRepository',
      useClass: CamionRepository,
    },
    {
      provide: 'ITrajectoireRepository',
      useClass: TrajectoireRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
    {
      provide: 'IResponsableMagasinRepository',
      useClass: ResponsableMagasinRepository,
    },
    // Services
    AdminService,
    ClientService,
    CatalogueCreneauxService,
    CamionService,
    TrajectoireService,
    NotificationService,
    ResponsableMagasinService,
  ],
  exports: [
    TypeOrmModule,
    AdminService,
    ClientService,
    CatalogueCreneauxService,
    CamionService,
    TrajectoireService,
    NotificationService,
    ResponsableMagasinService,
    // Export aussi les tokens pour les use cases
    'IAdminRepository',
    'IClientRepository',
    'ICatalogueCreneauxRepository',
    'ICamionRepository',
    'ITrajectoireRepository',
    'INotificationRepository',
    'IResponsableMagasinRepository',
  ],
})
export class InfrastructureModule {}