import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Trajectoire } from './trajectoire.entity';

@Entity('camion')
export class Camion {
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

  @OneToOne(() => Trajectoire, (trajectoire) => trajectoire.camion)
  trajectoire: Trajectoire;
}