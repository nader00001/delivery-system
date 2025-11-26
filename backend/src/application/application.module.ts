import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

// Import des Use Cases Admin
import { CreateAdminUseCase } from './use-cases/admin/create-admin.use-case';
import { GetAdminUseCase } from './use-cases/admin/get-admin.use-case';
import { GetAllAdminsUseCase } from './use-cases/admin/get-all-admins.use-case';
import { UpdateAdminUseCase } from './use-cases/admin/update-admin.use-case';
import { DeleteAdminUseCase } from './use-cases/admin/delete-admin.use-case';
import { LoginAdminUseCase } from './use-cases/admin/login-admin.use-case';

// Import des Use Cases Client
import { CreateClientUseCase } from './use-cases/client/create-client.use-case';
import { GetClientsByAdminUseCase } from './use-cases/client/get-clients-by-admin.use-case';

// Import des Use Cases Catalogue
import { CreateCatalogueUseCase } from './use-cases/catalogue-creneaux/create-catalogue.use-case';
import { ValiderCatalogueUseCase } from './use-cases/catalogue-creneaux/valider-catalogue.use-case';
import { RefuserCatalogueUseCase } from './use-cases/catalogue-creneaux/refuser-catalogue.use-case';

// Import des Use Cases Trajectoire
import { CreateTrajectoireUseCase } from './use-cases/trajectoire/create-trajectoire.use-case';
// import { UpdatePositionUseCase } from './use-cases/trajectoire/update-position.use-case';
import { ConfirmerArriveeUseCase } from './use-cases/trajectoire/confirmer-arrivee.use-case';

// Import des Use Cases Notification
import { EnvoyerNotificationUseCase } from './use-cases/notification/envoyer-notification.use-case';
import { MarquerNotificationLueUseCase } from './use-cases/notification/marquer-notification-lue.use-case';
import { GetNotificationsNonLuesUseCase } from './use-cases/notification/get-notifications-non-lues.use-case';

@Module({
  imports: [InfrastructureModule],
  providers: [
    // Admin Use Cases
    CreateAdminUseCase,
    GetAdminUseCase,
    GetAllAdminsUseCase,
    UpdateAdminUseCase,
    DeleteAdminUseCase,
    LoginAdminUseCase,
    // Client Use Cases
    CreateClientUseCase,
    GetClientsByAdminUseCase,
    // Catalogue Use Cases
    CreateCatalogueUseCase,
    ValiderCatalogueUseCase,
    RefuserCatalogueUseCase,
    // Trajectoire Use Cases
    CreateTrajectoireUseCase,
    // UpdatePositionUseCase,
    ConfirmerArriveeUseCase,
    // Notification Use Cases
    EnvoyerNotificationUseCase,
    MarquerNotificationLueUseCase,
    GetNotificationsNonLuesUseCase,
  ],
  exports: [
    // Export des Use Cases pour les controllers
    CreateAdminUseCase,
    GetAdminUseCase,
    GetAllAdminsUseCase,
    UpdateAdminUseCase,
    DeleteAdminUseCase,
    LoginAdminUseCase,
    CreateClientUseCase,
    GetClientsByAdminUseCase,
    CreateCatalogueUseCase,
    ValiderCatalogueUseCase,
    RefuserCatalogueUseCase,
    CreateTrajectoireUseCase,
    // UpdatePositionUseCase,
    ConfirmerArriveeUseCase,
    EnvoyerNotificationUseCase,
    MarquerNotificationLueUseCase,
    GetNotificationsNonLuesUseCase,
  ],
})
export class ApplicationModule {}