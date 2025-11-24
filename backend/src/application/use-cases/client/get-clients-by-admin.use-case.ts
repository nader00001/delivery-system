import { Injectable, Inject } from '@nestjs/common';
import { IClientRepository } from '../../../core/repository/client.repository.interface';
import { Client } from '../../../core/entities/client.entity';

@Injectable()
export class GetClientsByAdminUseCase {
  constructor(
    @Inject('IClientRepository')
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(adminId: number): Promise<Client[]> {
    return await this.clientRepository.findByAdminId(adminId);
  }
}