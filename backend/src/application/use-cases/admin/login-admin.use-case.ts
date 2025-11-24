import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IAdminRepository } from '../../../core/repository/admin.repository.interface';
import { Admin } from '../../../core/entities/admin.entity';
import { LoginAdminDto } from '../../dto/admin/login-admin.dto';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginAdminUseCase {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(dto: LoginAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findByEmail(dto.email);
    if (!admin) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await (dto.motDePasse== admin.motDePasse);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return admin;
  }
}
