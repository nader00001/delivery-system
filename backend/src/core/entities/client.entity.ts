import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Admin } from './admin.entity';
import { CatalogueCreneaux } from './catalogue_creneaux.entity';
import { Notification } from './notification.entity';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  idClient: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 150, nullable: true })
  entreprise: string;

  @Column({ length: 20 })
  telephone: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ type: 'text', nullable: true })
  adresse: string;

  @ManyToOne(() => Admin, (admin) => admin.clients)
  @JoinColumn({ name: 'idAdmin' })
  admin: Admin;

  @OneToMany(() => CatalogueCreneaux, (catalogue) => catalogue.client)
  catalogues: CatalogueCreneaux[];
}