import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IResponsableMagasinRepository } from '../../core/repository/responsable-magasin.repository.interface';
import { ResponsableMagasin } from '../../core/entities/responsable-magasin.entity';
import { ResponsableMagasinTypeORM } from '../database/responsable-magasin.orm.entity';

@Injectable()
export class ResponsableMagasinRepository implements IResponsableMagasinRepository {
  constructor(
    @InjectRepository(ResponsableMagasinTypeORM)
    private readonly repository: Repository<ResponsableMagasinTypeORM>,
  ) {}

  private toDomain(orm: ResponsableMagasinTypeORM): ResponsableMagasin {
    const responsable = new ResponsableMagasin();
    responsable.idResponsable = orm.idResponsable;
    responsable.nom = orm.nom;
    responsable.email = orm.email;
    responsable.motDePasse = orm.motDePasse;
    responsable.magasin = orm.magasin;
    responsable.actif = orm.actif;
    return responsable;
  }

  private toOrm(domain: Partial<ResponsableMagasin>): Partial<ResponsableMagasinTypeORM> {
    const orm = new ResponsableMagasinTypeORM();
    if (domain.idResponsable) orm.idResponsable = domain.idResponsable;
    if (domain.nom) orm.nom = domain.nom;
    if (domain.email) orm.email = domain.email;
    if (domain.motDePasse) orm.motDePasse = domain.motDePasse;
    if (domain.magasin) orm.magasin = domain.magasin;
    if (domain.actif !== undefined) orm.actif = domain.actif;
    return orm;
  }

  async findAll(): Promise<ResponsableMagasin[]> {
    const responsables = await this.repository.find();
    return responsables.map(this.toDomain);
  }

  async findById(id: number): Promise<ResponsableMagasin | null> {
    const responsable = await this.repository.findOne({ where: { idResponsable: id } });
    return responsable ? this.toDomain(responsable) : null;
  }

  async findByEmail(email: string): Promise<ResponsableMagasin | null> {
    const responsable = await this.repository.findOne({ where: { email } });
    return responsable ? this.toDomain(responsable) : null;
  }

  async findActifs(): Promise<ResponsableMagasin[]> {
    const responsables = await this.repository.find({ where: { actif: true } });
    return responsables.map(this.toDomain);
  }

  async create(responsable: Partial<ResponsableMagasin>): Promise<ResponsableMagasin> {
    const orm = this.repository.create(this.toOrm(responsable));
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async update(id: number, responsable: Partial<ResponsableMagasin>): Promise<ResponsableMagasin> {
    await this.repository.update(id, this.toOrm(responsable));
    const updated = await this.repository.findOne({ where: { idResponsable: id } });
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}