import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CatalogueCreneauxTypeORM } from './catalogue-creneaux.orm.entity';
import { ResponsableMagasinTypeORM } from './responsable-magasin.orm.entity';

@Entity('notification')
export class NotificationTypeORM {
  @PrimaryGeneratedColumn()
  idNotification: number;

  @Column({ type: 'enum', enum: ['validation', 'refus', 'info', 'alerte'], default: 'info' })
  type: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateEnvoi: Date;

  @Column({ type: 'boolean', default: false })
  lue: boolean;

  @ManyToOne(() => CatalogueCreneauxTypeORM, (catalogue) => catalogue.notifications, { nullable: true })
  @JoinColumn({ name: 'idCatalogue' })
  catalogue: CatalogueCreneauxTypeORM;

  @Column({ nullable: true })
  idCatalogue: number;

  @ManyToOne(() => ResponsableMagasinTypeORM, (responsable) => responsable.notifications)
  @JoinColumn({ name: 'idResponsable' })
  responsable: ResponsableMagasinTypeORM;

  @Column()
  idResponsable: number;
}
