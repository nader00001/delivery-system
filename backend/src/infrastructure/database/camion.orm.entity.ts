import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { TrajectoireTypeORM } from './trajectoire.orm.entity';

@Entity('camion')
export class CamionTypeORM {
  @PrimaryGeneratedColumn()
  idCamion: number;

  @Column({ length: 100 })
  chauffeur: string;

  @Column({ length: 20 })
  telChauffeur: string;

  @Column({ length: 50, nullable: true })
  immatriculation: string;

  @Column({ length: 50, nullable: true })
  modele: string;

  @OneToOne(() => TrajectoireTypeORM, (trajectoire) => trajectoire.camion)
  trajectoire: TrajectoireTypeORM;
}
