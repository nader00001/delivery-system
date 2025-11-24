import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NotificationTypeORM } from './notification.orm.entity';

@Entity('responsable_magasin')
export class ResponsableMagasinTypeORM {
  @PrimaryGeneratedColumn()
  idResponsable: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  motDePasse: string;

  @Column({ length: 150, nullable: true })
  magasin: string;

  @Column({ type: 'boolean', default: true })
  actif: boolean;

  @OneToMany(() => NotificationTypeORM, (notification) => notification.responsable)
  notifications: NotificationTypeORM[];
}