import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import des entités TypeORM
import { AdminTypeORM } from './infrastructure/database/admin.orm.entity';
import { ClientTypeORM } from './infrastructure/database/client.orm.entity';
import { CatalogueCreneauxTypeORM } from './infrastructure/database/catalogue-creneaux.orm.entity';
import { CamionTypeORM } from './infrastructure/database/camion.orm.entity';
import { TrajectoireTypeORM } from './infrastructure/database/trajectoire.orm.entity';
import { NotificationTypeORM } from './infrastructure/database/notification.orm.entity';
import { ResponsableMagasinTypeORM } from './infrastructure/database/responsable-magasin.orm.entity';

// Import des modules
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    // Configuration des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuration TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'creneaux_db',
      entities: [
        AdminTypeORM,
        ClientTypeORM,
        CatalogueCreneauxTypeORM,
        CamionTypeORM,
        TrajectoireTypeORM,
        NotificationTypeORM,
        ResponsableMagasinTypeORM,
      ],
      synchronize: process.env.NODE_ENV !== 'production', // ⚠️ false en production
      logging: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
    }),

    // Modules de l'application
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
  ],
})
export class AppModule {}