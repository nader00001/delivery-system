import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICatalogueCreneauxRepository } from '../../../core/repository/catalogue-creneaux.repository.interface';
import { INotificationRepository } from '../../../core/repository/notification.repository.interface';
import { CatalogueCreneaux } from '../../../core/entities/catalogue_creneaux.entity';
import { ResponsableMagasin } from 'src/core/entities/responsable-magasin.entity';

@Injectable()
export class RefuserCatalogueUseCase {
  constructor(
    @Inject('ICatalogueCreneauxRepository')
    private readonly catalogueRepository: ICatalogueCreneauxRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(catalogueId: number, responsable: ResponsableMagasin, raison: string): Promise<CatalogueCreneaux> {
    const catalogue = await this.catalogueRepository.findById(catalogueId);
    if (!catalogue) {
      throw new NotFoundException(`Catalogue avec l'ID ${catalogueId} introuvable`);
    }

    const updated = await this.catalogueRepository.update(catalogueId, { statut: 'refuse' });

    // Envoyer notification
    await this.notificationRepository.create({
      type: 'refus',
      message: `Le créneau du ${catalogue.dateDebut} a été refusé. Raison: ${raison}`,
      responsable,
      catalogue,
      lue: false,
    });

    return updated;
  }
}
