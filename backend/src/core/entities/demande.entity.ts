import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Demande {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    heure: string;

    @Column()
    type: string;

    @Column()
    statut: string;

    @Column()
    client_id: number;

    @Column()
    creneau_id: number;
}
