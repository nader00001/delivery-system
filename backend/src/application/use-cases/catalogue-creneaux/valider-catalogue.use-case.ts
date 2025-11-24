import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICatalogueCreneauxRepository } from '../../../core/repository/catalogue-creneaux.repository.interface';
import { INotificationRepository } from '../../../core/repository/notification.repository.interface';
import { CatalogueCreneaux } from '../../../core/entities/catalogue_creneaux.entity';
import { ResponsableMagasin } from 'src/core/entities/responsable-magasin.entity';

@Injectable()
export class ValiderCatalogueUseCase {
  constructor(
    @Inject('ICatalogueCreneauxRepository')
    private readonly catalogueRepository: ICatalogueCreneauxRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(catalogueId: number, responsable: ResponsableMagasin): Promise<CatalogueCreneaux> {
    const catalogue = await this.catalogueRepository.findById(catalogueId);
    if (!catalogue) {
      throw new NotFoundException(`Catalogue avec l'ID ${catalogueId} introuvable`);
    }

    const updated = await this.catalogueRepository.update(catalogueId, { statut: 'valide' });

    // Envoyer notification
    await this.notificationRepository.create({
      type: 'validation',
      message: `Le créneau du ${catalogue.dateDebut} a été validé`,
      responsable,
      catalogue,
      lue: false,
    });

    return updated;
  }
}