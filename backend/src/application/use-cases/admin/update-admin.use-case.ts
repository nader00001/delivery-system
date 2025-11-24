import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAdminRepository } from '../../../core/repository/admin.repository.interface';
import { Admin } from '../../../core/entities/admin.entity';
import { UpdateAdminDto } from '../../dto/admin/update-admin.dto';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateAdminUseCase {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin avec l'ID ${id} introuvable`);
    }

    const updateData: Partial<Admin> = { ...dto };
    
    // if (dto.motDePasse) {
    //   updateData.motDePasse = await bcrypt.hash(dto.motDePasse, 10);
    // }

    return await this.adminRepository.update(id, updateData);
  }
}
