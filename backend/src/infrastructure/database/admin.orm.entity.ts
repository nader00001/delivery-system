import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClientTypeORM } from './client.orm.entity';

@Entity('admin')
export class AdminTypeORM {
  @PrimaryGeneratedColumn()
  idAdmin: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  motDePasse: string;

  @OneToMany(() => ClientTypeORM, (client) => client.admin)
  clients: ClientTypeORM[];
}