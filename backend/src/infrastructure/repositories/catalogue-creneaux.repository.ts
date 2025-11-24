import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ICatalogueCreneauxRepository } from '../../core/repository/catalogue-creneaux.repository.interface';
import { CatalogueCreneaux } from '../../core/entities/catalogue_creneaux.entity';
import { CatalogueCreneauxTypeORM } from '../database/catalogue-creneaux.orm.entity';

@Injectable()
export class CatalogueCreneauxRepository implements ICatalogueCreneauxRepository {
  constructor(
    @InjectRepository(CatalogueCreneauxTypeORM)
    private readonly repository: Repository<CatalogueCreneauxTypeORM>,
  ) {}

  private toDomain(orm: CatalogueCreneauxTypeORM): CatalogueCreneaux {
    const catalogue = new CatalogueCreneaux();
    catalogue.idCatalogue = orm.idCatalogue;
    catalogue.dateDebut = orm.dateDebut;
    catalogue.dateFin = orm.dateFin;
    catalogue.statut = orm.statut;
    catalogue.client.idClient = orm.idClient;
    return catalogue;
  }

  private toOrm(domain: Partial<CatalogueCreneaux>): Partial<CatalogueCreneauxTypeORM> {
    const orm = new CatalogueCreneauxTypeORM();
    if (domain.idCatalogue) orm.idCatalogue = domain.idCatalogue;
    if (domain.dateDebut) orm.dateDebut = domain.dateDebut;
    if (domain.dateFin) orm.dateFin = domain.dateFin;
    if (domain.statut) orm.statut = domain.statut;
    if (domain.client.idClient) orm.idClient = domain.client.idClient;
    return orm;
  }

  async findAll(): Promise<CatalogueCreneaux[]> {
    const catalogues = await this.repository.find();
    return catalogues.map(this.toDomain);
  }

  async findById(id: number): Promise<CatalogueCreneaux | null> {
    const catalogue = await this.repository.findOne({ where: { idCatalogue: id } });
    return catalogue ? this.toDomain(catalogue) : null;
  }

  async findByClientId(clientId: number): Promise<CatalogueCreneaux[]> {
    const catalogues = await this.repository.find({ where: { idClient: clientId } });
    return catalogues.map(this.toDomain);
  }

  async findByStatut(statut: string): Promise<CatalogueCreneaux[]> {
    const catalogues = await this.repository.find({ where: { statut } });
    return catalogues.map(this.toDomain);
  }

  async findByDateRange(dateDebut: Date, dateFin: Date): Promise<CatalogueCreneaux[]> {
    const catalogues = await this.repository.find({
      where: {
        dateDebut: Between(dateDebut, dateFin),
      },
    });
    return catalogues.map(this.toDomain);
  }

  async create(catalogue: Partial<CatalogueCreneaux>): Promise<CatalogueCreneaux> {
    const orm = this.repository.create(this.toOrm(catalogue));
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async update(id: number, catalogue: Partial<CatalogueCreneaux>): Promise<CatalogueCreneaux> {
    await this.repository.update(id, this.toOrm(catalogue));
    const updated = await this.repository.findOne({ where: { idCatalogue: id } });
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}