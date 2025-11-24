import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITrajectoireRepository } from '../../core/repository/trajectoire.repository.interface';
import { Trajectoire } from '../../core/entities/trajectoire.entity';

@Injectable()
export class TrajectoireService {
  constructor(
    @Inject('ITrajectoireRepository')
    private readonly trajectoireRepository: ITrajectoireRepository,
  ) {}

  async findAll(): Promise<Trajectoire[]> {
    return await this.trajectoireRepository.findAll();
  }

  async findById(id: number): Promise<Trajectoire> {
    const trajectoire = await this.trajectoireRepository.findById(id);
    if (!trajectoire) {
      throw new NotFoundException(`Trajectoire avec l'ID ${id} introuvable`);
    }
    return trajectoire;
  }

  async findByCatalogueId(catalogueId: number): Promise<Trajectoire[]> {
    return await this.trajectoireRepository.findByCatalogueId(catalogueId);
  }

  async findByCamionId(camionId: number): Promise<Trajectoire | null> {
    return await this.trajectoireRepository.findByCamionId(camionId);
  }

  async create(trajectoireData: Partial<Trajectoire>): Promise<Trajectoire> {
    // Validation des coordonnées GPS
    if (trajectoireData.latitudeActuelle < -90 || trajectoireData.latitudeActuelle > 90) {
      throw new BadRequestException('Latitude invalide (doit être entre -90 et 90)');
    }
    if (trajectoireData.longitudeActuelle < -180 || trajectoireData.longitudeActuelle > 180) {
      throw new BadRequestException('Longitude invalide (doit être entre -180 et 180)');
    }
    return await this.trajectoireRepository.create(trajectoireData);
  }

  async update(id: number, trajectoireData: Partial<Trajectoire>): Promise<Trajectoire> {
    const trajectoire = await this.trajectoireRepository.findById(id);
    if (!trajectoire) {
      throw new NotFoundException(`Trajectoire avec l'ID ${id} introuvable`);
    }
    return await this.trajectoireRepository.update(id, trajectoireData);
  }

  async updatePosition(id: number, latitude: number, longitude: number): Promise<Trajectoire> {
    const trajectoire = await this.trajectoireRepository.findById(id);
    if (!trajectoire) {
      throw new NotFoundException(`Trajectoire avec l'ID ${id} introuvable`);
    }

    if (latitude < -90 || latitude > 90) {
      throw new BadRequestException('Latitude invalide');
    }
    if (longitude < -180 || longitude > 180) {
      throw new BadRequestException('Longitude invalide');
    }

    return await this.trajectoireRepository.updatePosition(id, latitude, longitude);
  }

  async confirmerArrivee(id: number): Promise<Trajectoire> {
    return await this.trajectoireRepository.update(id, { 
      dateArrivee: new Date() 
    });
  }

  async delete(id: number): Promise<boolean> {
    const trajectoire = await this.trajectoireRepository.findById(id);
    if (!trajectoire) {
      throw new NotFoundException(`Trajectoire avec l'ID ${id} introuvable`);
    }
    return await this.trajectoireRepository.delete(id);
  }
}