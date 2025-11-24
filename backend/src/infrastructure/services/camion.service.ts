import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICamionRepository } from '../../core/repository/camion.repository.interface';
import { Camion } from '../../core/entities/camion.entity';

@Injectable()
export class CamionService {
  constructor(
    @Inject('ICamionRepository')
    private readonly camionRepository: ICamionRepository,
  ) {}

  async findAll(): Promise<Camion[]> {
    return await this.camionRepository.findAll();
  }

  async findById(id: number): Promise<Camion> {
    const camion = await this.camionRepository.findById(id);
    if (!camion) {
      throw new NotFoundException(`Camion avec l'ID ${id} introuvable`);
    }
    return camion;
  }

  async findByChauffeur(chauffeur: string): Promise<Camion[]> {
    return await this.camionRepository.findByChauffeur(chauffeur);
  }

  async create(camionData: Partial<Camion>): Promise<Camion> {
    return await this.camionRepository.create(camionData);
  }

  async update(id: number, camionData: Partial<Camion>): Promise<Camion> {
    const camion = await this.camionRepository.findById(id);
    if (!camion) {
      throw new NotFoundException(`Camion avec l'ID ${id} introuvable`);
    }
    return await this.camionRepository.update(id, camionData);
  }

  async delete(id: number): Promise<boolean> {
    const camion = await this.camionRepository.findById(id);
    if (!camion) {
      throw new NotFoundException(`Camion avec l'ID ${id} introuvable`);
    }
    return await this.camionRepository.delete(id);
  }
}