import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AdminTypeORM } from './admin.orm.entity';
import { CatalogueCreneauxTypeORM } from './catalogue-creneaux.orm.entity';

@Entity('client')
export class ClientTypeORM {
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

  @ManyToOne(() => AdminTypeORM, (admin) => admin.clients)
  @JoinColumn({ name: 'idAdmin' })
  admin: AdminTypeORM;

  @Column()
  idAdmin: number;

  @OneToMany(() => CatalogueCreneauxTypeORM, (catalogue) => catalogue.client)
  catalogues: CatalogueCreneauxTypeORM[];
}