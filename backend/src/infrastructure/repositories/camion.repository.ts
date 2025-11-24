import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ICamionRepository } from '../../core/repository/camion.repository.interface';
import { Camion } from '../../core/entities/camion.entity';
import { CamionTypeORM } from '../database/camion.orm.entity';

@Injectable()
export class CamionRepository implements ICamionRepository {
  constructor(
    @InjectRepository(CamionTypeORM)
    private readonly repository: Repository<CamionTypeORM>,
  ) {}

  private toDomain(orm: CamionTypeORM): Camion {
    const camion = new Camion();
    camion.idCamion = orm.idCamion;
    camion.chauffeur = orm.chauffeur;
    camion.telChauffeur = orm.telChauffeur;
    camion.immatriculation = orm.immatriculation;
    camion.modele = orm.modele;
    return camion;
  }

  private toOrm(domain: Partial<Camion>): Partial<CamionTypeORM> {
    const orm = new CamionTypeORM();
    if (domain.idCamion) orm.idCamion = domain.idCamion;
    if (domain.chauffeur) orm.chauffeur = domain.chauffeur;
    if (domain.telChauffeur) orm.telChauffeur = domain.telChauffeur;
    if (domain.immatriculation) orm.immatriculation = domain.immatriculation;
    if (domain.modele) orm.modele = domain.modele;
    return orm;
  }

  async findAll(): Promise<Camion[]> {
    const camions = await this.repository.find();
    return camions.map(this.toDomain);
  }

  async findById(id: number): Promise<Camion | null> {
    const camion = await this.repository.findOne({ where: { idCamion: id } });
    return camion ? this.toDomain(camion) : null;
  }

  async findByChauffeur(chauffeur: string): Promise<Camion[]> {
    const camions = await this.repository.find({ where: { chauffeur: Like(`%${chauffeur}%`) } });
    return camions.map(this.toDomain);
  }

  async create(camion: Partial<Camion>): Promise<Camion> {
    const orm = this.repository.create(this.toOrm(camion));
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async update(id: number, camion: Partial<Camion>): Promise<Camion> {
    await this.repository.update(id, this.toOrm(camion));
    const updated = await this.repository.findOne({ where: { idCamion: id } });
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
