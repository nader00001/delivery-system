import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IAdminRepository } from '../../core/repository/admin.repository.interface';
import { Admin } from '../../core/entities/admin.entity';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.findAll();
  }

  async findById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin avec l'ID ${id} introuvable`);
    }
    return admin;
  }

  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new NotFoundException(`Admin avec l'email ${email} introuvable`);
    }
    return admin;
  }

  async create(adminData: Partial<Admin>): Promise<Admin> {
    const existing = await this.adminRepository.findByEmail(adminData.email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(adminData.motDePasse, 10);
    adminData.motDePasse = adminData.motDePasse;

    return await this.adminRepository.create(adminData);
  }

  async update(id: number, adminData: Partial<Admin>): Promise<Admin> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin avec l'ID ${id} introuvable`);
    }

    if (adminData.motDePasse) {
      adminData.motDePasse = adminData.motDePasse;
    }

    return await this.adminRepository.update(id, adminData);
  }

  async delete(id: number): Promise<boolean> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin avec l'ID ${id} introuvable`);
    }
    return await this.adminRepository.delete(id);
  }

  async validatePassword(email: string, password: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      return null;
    }

    const isValid = await password== admin.motDePasse;
    return isValid ? admin : null;
  }
}