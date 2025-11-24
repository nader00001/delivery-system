import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITrajectoireRepository } from '../../../core/repository/trajectoire.repository.interface';
import { INotificationRepository } from '../../../core/repository/notification.repository.interface';
import { Trajectoire } from '../../../core/entities/trajectoire.entity';
import { ResponsableMagasin } from 'src/core/entities/responsable-magasin.entity';

@Injectable()
export class ConfirmerArriveeUseCase {
  constructor(
    @Inject('ITrajectoireRepository')
    private readonly trajectoireRepository: ITrajectoireRepository,
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(trajectoireId: number, responsable: ResponsableMagasin): Promise<Trajectoire> {
    const trajectoire = await this.trajectoireRepository.findById(trajectoireId);
    if (!trajectoire) {
      throw new NotFoundException(`Trajectoire avec l'ID ${trajectoireId} introuvable`);
    }

    const updated = await this.trajectoireRepository.update(trajectoireId, {
      dateArrivee: new Date(),
    });

    // Envoyer notification d'arrivée
    await this.notificationRepository.create({
      type: 'info',
      message: `Le camion est arrivé à destination`,
      responsable,
      catalogue: trajectoire.catalogue,
      lue: false,
    });

    return updated;
  }
}