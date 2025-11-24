import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IClientRepository } from '../../../core/repository/client.repository.interface';
import { Client } from '../../../core/entities/client.entity';
import { CreateClientDto } from '../../dto/client/create-client.dto';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject('IClientRepository')
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(dto: CreateClientDto): Promise<Client> {
    const existing = await this.clientRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    return await this.clientRepository.create({
      nom: dto.nom,
      entreprise: dto.entreprise,
      telephone: dto.telephone,
      email: dto.email,
      adresse: dto.adresse,
      admin: dto.adminId,
    });
  }
}