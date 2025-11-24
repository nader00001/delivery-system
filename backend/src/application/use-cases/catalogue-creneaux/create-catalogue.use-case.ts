import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ICatalogueCreneauxRepository } from '../../../core/repository/catalogue-creneaux.repository.interface';
import { CatalogueCreneaux } from '../../../core/entities/catalogue_creneaux.entity';
import { CreateCatalogueDto } from '../../dto/catalogue-creneaux/create-catalogue.dto';

@Injectable()
export class CreateCatalogueUseCase {
  constructor(
    @Inject('ICatalogueCreneauxRepository')
    private readonly catalogueRepository: ICatalogueCreneauxRepository,
  ) {}

  async execute(dto: CreateCatalogueDto): Promise<CatalogueCreneaux> {
    if (dto.dateDebut >= dto.dateFin) {
      throw new BadRequestException('La date de début doit être antérieure à la date de fin');
    }

    return await this.catalogueRepository.create({
      dateDebut: dto.dateDebut,
      dateFin: dto.dateFin,
      client: dto.clientId,
      statut: 'disponible',
    });
  }
}