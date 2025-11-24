import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IClientRepository } from '../../core/repository/client.repository.interface';
import { Client } from '../../core/entities/client.entity';
import { ClientTypeORM } from '../database/client.orm.entity';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientTypeORM)
    private readonly repository: Repository<ClientTypeORM>,
  ) {}

  private toDomain(orm: ClientTypeORM): Client {
    const client = new Client();
    client.idClient = orm.idClient;
    client.nom = orm.nom;
    client.entreprise = orm.entreprise;
    client.telephone = orm.telephone;
    client.email = orm.email;
    client.adresse = orm.adresse;
    client.admin.idAdmin = orm.idAdmin;
    return client;
  }

  private toOrm(domain: Partial<Client>): Partial<ClientTypeORM> {
    const orm = new ClientTypeORM();
    if (domain.idClient) orm.idClient = domain.idClient;
    if (domain.nom) orm.nom = domain.nom;
    if (domain.entreprise) orm.entreprise = domain.entreprise;
    if (domain.telephone) orm.telephone = domain.telephone;
    if (domain.email) orm.email = domain.email;
    if (domain.adresse) orm.adresse = domain.adresse;
    if (domain.admin.idAdmin) orm.idAdmin = domain.admin.idAdmin;
    return orm;
  }

  async findAll(): Promise<Client[]> {
    const clients = await this.repository.find();
    return clients.map(this.toDomain);
  }

  async findById(id: number): Promise<Client | null> {
    const client = await this.repository.findOne({ where: { idClient: id } });
    return client ? this.toDomain(client) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.repository.findOne({ where: { email } });
    return client ? this.toDomain(client) : null;
  }

  async findByAdminId(adminId: number): Promise<Client[]> {
    const clients = await this.repository.find({ where: { idAdmin: adminId } });
    return clients.map(this.toDomain);
  }

  async create(client: Partial<Client>): Promise<Client> {
    const orm = this.repository.create(this.toOrm(client));
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async update(id: number, client: Partial<Client>): Promise<Client> {
    await this.repository.update(id, this.toOrm(client));
    const updated = await this.repository.findOne({ where: { idClient: id } });
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}