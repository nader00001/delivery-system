import { Injectable, Inject } from '@nestjs/common';
import { IAdminRepository } from '../../../core/repository/admin.repository.interface';
import { Admin } from '../../../core/entities/admin.entity';
import { CreateAdminDto } from '../../dto/admin/create-admin.dto';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateAdminUseCase {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(dto: CreateAdminDto): Promise<Admin> {
    // const hashedPassword = await bcrypt.hash(dto.motDePasse, 10);
    
    return await this.adminRepository.create({
      nom: dto.nom,
      email: dto.email,
      motDePasse: dto.motDePasse,
    });
  }
}