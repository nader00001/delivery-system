import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IResponsableMagasinRepository } from '../../core/repository/responsable-magasin.repository.interface';
import { ResponsableMagasin } from '../../core/entities/responsable-magasin.entity';

@Injectable()
export class ResponsableMagasinService {
  constructor(
    @Inject('IResponsableMagasinRepository')
    private readonly responsableRepository: IResponsableMagasinRepository,
  ) {}

  async findAll(): Promise<ResponsableMagasin[]> {
    return await this.responsableRepository.findAll();
  }

  async findById(id: number): Promise<ResponsableMagasin> {
    const responsable = await this.responsableRepository.findById(id);
    if (!responsable) {
      throw new NotFoundException(`Responsable avec l'ID ${id} introuvable`);
    }
    return responsable;
  }

  async findByEmail(email: string): Promise<ResponsableMagasin> {
    const responsable = await this.responsableRepository.findByEmail(email);
    if (!responsable) {
      throw new NotFoundException(`Responsable avec l'email ${email} introuvable`);
    }
    return responsable;
  }

  async findActifs(): Promise<ResponsableMagasin[]> {
    return await this.responsableRepository.findActifs();
  }

  async create(responsableData: Partial<ResponsableMagasin>): Promise<ResponsableMagasin> {
    const existing = await this.responsableRepository.findByEmail(responsableData.email);
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(responsableData.motDePasse, 10);
    // responsableData.motDePasse = hashedPassword;

    return await this.responsableRepository.create(responsableData);
  }

  async update(id: number, responsableData: Partial<ResponsableMagasin>): Promise<ResponsableMagasin> {
    const responsable = await this.responsableRepository.findById(id);
    if (!responsable) {
      throw new NotFoundException(`Responsable avec l'ID ${id} introuvable`);
    }

    // if (responsableData.motDePasse) {
    //   responsableData.motDePasse = await bcrypt.hash(responsableData.motDePasse, 10);
    // }

    return await this.responsableRepository.update(id, responsableData);
  }

  async desactiver(id: number): Promise<ResponsableMagasin> {
    return await this.responsableRepository.update(id, { actif: false });
  }

  async activer(id: number): Promise<ResponsableMagasin> {
    return await this.responsableRepository.update(id, { actif: true });
  }

  async delete(id: number): Promise<boolean> {
    const responsable = await this.responsableRepository.findById(id);
    if (!responsable) {
      throw new NotFoundException(`Responsable avec l'ID ${id} introuvable`);
    }
    return await this.responsableRepository.delete(id);
  }

  async validatePassword(email: string, password: string): Promise<ResponsableMagasin | null> {
    const responsable = await this.responsableRepository.findByEmail(email);
    if (!responsable || !responsable.actif) {
      return null;
    }

    const isValid = await (password ==responsable.motDePasse);
    return isValid ? responsable : null;
  }
}