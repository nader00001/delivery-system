import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Client } from './client.entity';
import { Trajectoire } from './trajectoire.entity';
import { Notification } from './notification.entity';

@Entity('catalogue_creneaux')
export class CatalogueCreneaux {
  @PrimaryGeneratedColumn()
  idCatalogue: number;

  @Column({ type: 'timestamp' })
  dateDebut: Date;

  @Column({ type: 'timestamp' })
  dateFin: Date;

  @Column({ type: 'enum', enum: ['disponible', 'reserve', 'valide', 'refuse'], default: 'disponible' })
  statut: string;

  @ManyToOne(() => Client, (client) => client.catalogues)
  @JoinColumn({ name: 'idClient' })
  client: Client;

  @OneToMany(() => Trajectoire, (trajectoire) => trajectoire.catalogue)
  trajectoires: Trajectoire[];

  @OneToMany(() => Notification, (notification) => notification.catalogue)
  notifications: Notification[];
}