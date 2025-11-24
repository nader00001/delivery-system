import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './ormconfig';
import { AdminTypeORM } from './admin.orm.entity';
import { ClientTypeORM } from './client.orm.entity';
import { CatalogueCreneauxTypeORM } from './catalogue-creneaux.orm.entity';
import { CamionTypeORM } from './camion.orm.entity';
import { TrajectoireTypeORM } from './trajectoire.orm.entity';
import { NotificationTypeORM } from './notification.orm.entity';
import { ResponsableMagasinTypeORM } from './responsable-magasin.orm.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
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
  exports: [TypeOrmModule],
})
export class DatabaseModule {}