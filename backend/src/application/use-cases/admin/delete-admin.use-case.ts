import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAdminRepository } from '../../../core/repository/admin.repository.interface';

@Injectable()
export class DeleteAdminUseCase {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin avec l'ID ${id} introuvable`);
    }
    return await this.adminRepository.delete(id);
  }
}