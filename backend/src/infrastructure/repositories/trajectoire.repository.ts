import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITrajectoireRepository } from '../../core/repository/trajectoire.repository.interface';
import { Trajectoire } from '../../core/entities/trajectoire.entity';
import { TrajectoireTypeORM } from '../database/trajectoire.orm.entity';

@Injectable()
export class TrajectoireRepository implements ITrajectoireRepository {
  constructor(
    @InjectRepository(TrajectoireTypeORM)
    private readonly repository: Repository<TrajectoireTypeORM>,
  ) {}

  private toDomain(orm: TrajectoireTypeORM): Trajectoire {
    const trajectoire = new Trajectoire();
    trajectoire.idTrajectoire = orm.idTrajectoire;
    trajectoire.latitudeActuelle = Number(orm.latitudeActuelle);
    trajectoire.longitudeActuelle = Number(orm.longitudeActuelle);
    trajectoire.dateArrivee = orm.dateArrivee;
    trajectoire.observations = orm.observations;
    trajectoire.dateCreation = orm.dateCreation;
    trajectoire.catalogue.idCatalogue = orm.idCatalogue;
    trajectoire.camion.idCamion = orm.idCamion;
    return trajectoire;
  }

  private toOrm(domain: Partial<Trajectoire>): Partial<TrajectoireTypeORM> {
    const orm = new TrajectoireTypeORM();
    if (domain.idTrajectoire) orm.idTrajectoire = domain.idTrajectoire;
    if (domain.latitudeActuelle) orm.latitudeActuelle = domain.latitudeActuelle;
    if (domain.longitudeActuelle) orm.longitudeActuelle = domain.longitudeActuelle;
    if (domain.dateArrivee) orm.dateArrivee = domain.dateArrivee;
    if (domain.observations) orm.observations = domain.observations;
    if (domain.catalogue.idCatalogue) orm.idCatalogue = domain.catalogue.idCatalogue;
    if (domain.camion.idCamion) orm.idCamion = domain.camion.idCamion;
    return orm;
  }

  async findAll(): Promise<Trajectoire[]> {
    const trajectoires = await this.repository.find();
    return trajectoires.map(this.toDomain);
  }

  async findById(id: number): Promise<Trajectoire | null> {
    const trajectoire = await this.repository.findOne({ where: { idTrajectoire: id } });
    return trajectoire ? this.toDomain(trajectoire) : null;
  }

  async findByCatalogueId(catalogueId: number): Promise<Trajectoire[]> {
    const trajectoires = await this.repository.find({ where: { idCatalogue: catalogueId } });
    return trajectoires.map(this.toDomain);
  }

  async findByCamionId(camionId: number): Promise<Trajectoire | null> {
    const trajectoire = await this.repository.findOne({ where: { idCamion: camionId } });
    return trajectoire ? this.toDomain(trajectoire) : null;
  }

  async create(trajectoire: Partial<Trajectoire>): Promise<Trajectoire> {
    const orm = this.repository.create(this.toOrm(trajectoire));
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async update(id: number, trajectoire: Partial<Trajectoire>): Promise<Trajectoire> {
    await this.repository.update(id, this.toOrm(trajectoire));
    const updated = await this.repository.findOne({ where: { idTrajectoire: id } });
    return this.toDomain(updated);
  }

  async updatePosition(id: number, latitude: number, longitude: number): Promise<Trajectoire> {
    await this.repository.update(id, {
      latitudeActuelle: latitude,
      longitudeActuelle: longitude,
    });
    const updated = await this.repository.findOne({ where: { idTrajectoire: id } });
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}