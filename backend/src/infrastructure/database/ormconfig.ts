import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AdminTypeORM } from './admin.orm.entity';
import { ClientTypeORM } from './client.orm.entity';
import { CatalogueCreneauxTypeORM } from './catalogue-creneaux.orm.entity';
import { CamionTypeORM } from './camion.orm.entity';
import { TrajectoireTypeORM } from './trajectoire.orm.entity';
import { NotificationTypeORM } from './notification.orm.entity';
import { ResponsableMagasinTypeORM } from './responsable-magasin.orm.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres', // ou 'mysql', 'sqlite', etc.
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Nader@2022',
  database: process.env.DB_DATABASE || 'delivery_app',
  entities: [
    AdminTypeORM,
    ClientTypeORM,
    CatalogueCreneauxTypeORM,
    CamionTypeORM,
    TrajectoireTypeORM,
    NotificationTypeORM,
    ResponsableMagasinTypeORM,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
};
