import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAdminRepository } from '../../core/repository/admin.repository.interface';
import { Admin } from '../../core/entities/admin.entity';
import { AdminTypeORM } from '../database/admin.orm.entity';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @InjectRepository(AdminTypeORM)
    private readonly repository: Repository<AdminTypeORM>,
  ) {}

  private toDomain(orm: AdminTypeORM): Admin {
    const admin = new Admin();
    admin.idAdmin = orm.idAdmin;
    admin.nom = orm.nom;
    admin.email = orm.email;
    admin.motDePasse = orm.motDePasse;
    return admin;
  }

  private toOrm(domain: Partial<Admin>): Partial<AdminTypeORM> {
    const orm = new AdminTypeORM();
    if (domain.idAdmin) orm.idAdmin = domain.idAdmin;
    if (domain.nom) orm.nom = domain.nom;
    if (domain.email) orm.email = domain.email;
    if (domain.motDePasse) orm.motDePasse = domain.motDePasse;
    return orm;
  }

  async findAll(): Promise<Admin[]> {
    const admins = await this.repository.find();
    return admins.map(this.toDomain);
  }

  async findById(id: number): Promise<Admin | null> {
    const admin = await this.repository.findOne({ where: { idAdmin: id } });
    return admin ? this.toDomain(admin) : null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.repository.findOne({ where: { email } });
    return admin ? this.toDomain(admin) : null;
  }

  async create(admin: Partial<Admin>): Promise<Admin> {
    const orm = this.repository.create(this.toOrm(admin));
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async update(id: number, admin: Partial<Admin>): Promise<Admin> {
    await this.repository.update(id, this.toOrm(admin));
    const updated = await this.repository.findOne({ where: { idAdmin: id } });
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
