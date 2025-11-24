import { Injectable, Inject } from '@nestjs/common';
import { IAdminRepository } from '../../../core/repository/admin.repository.interface';
import { Admin } from '../../../core/entities/admin.entity';

@Injectable()
export class GetAllAdminsUseCase {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(): Promise<Admin[]> {
    return await this.adminRepository.findAll();
  }
}