import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAdminRepository } from '../../../core/repository/admin.repository.interface';
import { Admin } from '../../../core/entities/admin.entity';

@Injectable()
export class GetAdminUseCase {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin avec l'ID ${id} introuvable`);
    }
    return admin;
  }
}
