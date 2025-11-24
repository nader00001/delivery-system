import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ITrajectoireRepository } from '../../../core/repository/trajectoire.repository.interface';
import { Trajectoire } from '../../../core/entities/trajectoire.entity';
import { CreateTrajectoireDto } from '../../dto/trajectoire/create-trajectoire.dto';

@Injectable()
export class CreateTrajectoireUseCase {
  constructor(
    @Inject('ITrajectoireRepository')
    private readonly trajectoireRepository: ITrajectoireRepository,
  ) {}

  async execute(dto: CreateTrajectoireDto): Promise<Trajectoire> {
    if (dto.latitudeActuelle < -90 || dto.latitudeActuelle > 90) {
      throw new BadRequestException('Latitude invalide');
    }
    if (dto.longitudeActuelle < -180 || dto.longitudeActuelle > 180) {
      throw new BadRequestException('Longitude invalide');
    }

    return await this.trajectoireRepository.create({
      latitudeActuelle: dto.latitudeActuelle,
      longitudeActuelle: dto.longitudeActuelle,
      observations: dto.observations,
      catalogue: dto.catalogueId,
      camion: dto.camionId,
      dateCreation: new Date(),
    });
  }
}
