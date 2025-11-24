import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICatalogueCreneauxRepository } from '../../core/repository/catalogue-creneaux.repository.interface';
import { CatalogueCreneaux } from '../../core/entities/catalogue_creneaux.entity';

@Injectable()
export class CatalogueCreneauxService {
  constructor(
    @Inject('ICatalogueCreneauxRepository')
    private readonly catalogueRepository: ICatalogueCreneauxRepository,
  ) {}

  async findAll(): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findAll();
  }

  async findById(id: number): Promise<CatalogueCreneaux> {
    const catalogue = await this.catalogueRepository.findById(id);
    if (!catalogue) {
      throw new NotFoundException(`Catalogue avec l'ID ${id} introuvable`);
    }
    return catalogue;
  }

  async findByClientId(clientId: number): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findByClientId(clientId);
  }

  async findByStatut(statut: string): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findByStatut(statut);
  }

  async findDisponibles(): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findByStatut('disponible');
  }

  async findByDateRange(dateDebut: Date, dateFin: Date): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findByDateRange(dateDebut, dateFin);
  }

  async create(catalogueData: Partial<CatalogueCreneaux>): Promise<CatalogueCreneaux> {
    if (catalogueData.dateDebut >= catalogueData.dateFin) {
      throw new BadRequestException('La date de début doit être antérieure à la date de fin');
    }
    return await this.catalogueRepository.create(catalogueData);
  }

  async update(id: number, catalogueData: Partial<CatalogueCreneaux>): Promise<CatalogueCreneaux> {
    const catalogue = await this.catalogueRepository.findById(id);
    if (!catalogue) {
      throw new NotFoundException(`Catalogue avec l'ID ${id} introuvable`);
    }
    return await this.catalogueRepository.update(id, catalogueData);
  }

  async valider(id: number): Promise<CatalogueCreneaux> {
    return await this.catalogueRepository.update(id, { statut: 'valide' });
  }

  async refuser(id: number): Promise<CatalogueCreneaux> {
    return await this.catalogueRepository.update(id, { statut: 'refuse' });
  }

  async delete(id: number): Promise<boolean> {
    const catalogue = await this.catalogueRepository.findById(id);
    if (!catalogue) {
      throw new NotFoundException(`Catalogue avec l'ID ${id} introuvable`);
    }
    return await this.catalogueRepository.delete(id);
  }
}