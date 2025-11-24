import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { CatalogueCreneaux } from './catalogue_creneaux.entity';
import { Camion } from './camion.entity';

@Entity('trajectoire')
export class Trajectoire {
  @PrimaryGeneratedColumn()
  idTrajectoire: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitudeActuelle: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitudeActuelle: number;

  @Column({ type: 'timestamp', nullable: true })
  dateArrivee: Date;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreation: Date;

  @ManyToOne(() => CatalogueCreneaux, (catalogue) => catalogue.trajectoires)
  @JoinColumn({ name: 'idCatalogue' })
  catalogue: CatalogueCreneaux;

  @OneToOne(() => Camion, (camion) => camion.trajectoire)
  @JoinColumn({ name: 'idCamion' })
  camion: Camion;
}