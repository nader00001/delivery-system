import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { CatalogueCreneauxTypeORM } from './catalogue-creneaux.orm.entity';
import { CamionTypeORM } from './camion.orm.entity';

@Entity('trajectoire')
export class TrajectoireTypeORM {
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

  @ManyToOne(() => CatalogueCreneauxTypeORM, (catalogue) => catalogue.trajectoires)
  @JoinColumn({ name: 'idCatalogue' })
  catalogue: CatalogueCreneauxTypeORM;

  @Column()
  idCatalogue: number;

  @OneToOne(() => CamionTypeORM, (camion) => camion.trajectoire)
  @JoinColumn({ name: 'idCamion' })
  camion: CamionTypeORM;

  @Column()
  idCamion: number;
}