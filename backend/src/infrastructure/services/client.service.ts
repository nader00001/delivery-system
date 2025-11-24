import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IClientRepository } from '../../core/repository/client.repository.interface';
import { Client } from '../../core/entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @Inject('IClientRepository')
    private readonly clientRepository: IClientRepository,
  ) {}

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.findAll();
  }

  async findById(id: number): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} introuvable`);
    }
    return client;
  }

  async findByEmail(email: string): Promise<Client> {
    const client = await this.clientRepository.findByEmail(email);
    if (!client) {
      throw new NotFoundException(`Client avec l'email ${email} introuvable`);
    }
    return client;
  }

  async findByAdminId(adminId: number): Promise<Client[]> {
    return await this.clientRepository.findByAdminId(adminId);
  }

  async create(clientData: Partial<Client>): Promise<Client> {
    const existing = await this.clientRepository.findByEmail(clientData.email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }
    return await this.clientRepository.create(clientData);
  }

  async update(id: number, clientData: Partial<Client>): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} introuvable`);
    }
    return await this.clientRepository.update(id, clientData);
  }

  async delete(id: number): Promise<boolean> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} introuvable`);
    }
    return await this.clientRepository.delete(id);
  }
}