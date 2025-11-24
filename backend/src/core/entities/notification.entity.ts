import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CatalogueCreneaux } from './catalogue_creneaux.entity';
import { ResponsableMagasin } from './responsable-magasin.entity';

@Entity('notification')
export class Notification {
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

  @ManyToOne(() => CatalogueCreneaux, (catalogue) => catalogue.notifications, { nullable: true })
  @JoinColumn({ name: 'idCatalogue' })
  catalogue: CatalogueCreneaux;

  @ManyToOne(() => ResponsableMagasin, (responsable) => responsable.notifications)
  @JoinColumn({ name: 'idResponsable' })
  responsable: ResponsableMagasin;
}
