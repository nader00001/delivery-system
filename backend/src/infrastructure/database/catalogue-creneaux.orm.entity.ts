import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ClientTypeORM } from './client.orm.entity';
import { TrajectoireTypeORM } from './trajectoire.orm.entity';
import { NotificationTypeORM } from './notification.orm.entity';

@Entity('catalogue_creneaux')
export class CatalogueCreneauxTypeORM {
  @PrimaryGeneratedColumn()
  idCatalogue: number;

  @Column({ type: 'timestamp' })
  dateDebut: Date;

  @Column({ type: 'timestamp' })
  dateFin: Date;

  @Column({ type: 'enum', enum: ['disponible', 'reserve', 'valide', 'refuse'], default: 'disponible' })
  statut: string;

  @ManyToOne(() => ClientTypeORM, (client) => client.catalogues)
  @JoinColumn({ name: 'idClient' })
  client: ClientTypeORM;

  @Column()
  idClient: number;

  @OneToMany(() => TrajectoireTypeORM, (trajectoire) => trajectoire.catalogue)
  trajectoires: TrajectoireTypeORM[];

  @OneToMany(() => NotificationTypeORM, (notification) => notification.catalogue)
  notifications: NotificationTypeORM[];
}