import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Client } from './client.entity';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  idAdmin: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  motDePasse: string;

  @OneToMany(() => Client, (client) => client.admin)
  clients: Client[];
}