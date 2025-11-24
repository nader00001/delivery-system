import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITrajectoireRepository } from '../../../core/repository/trajectoire.repository.interface';
import { Trajectoire } from '../../../core/entities/trajectoire.entity';
import { UpdatePositionDto } from '../../dto/trajectoire/update-position.dto';

@Injectable()
export class UpdatePositionUseCase {
  constructor(
    @Inject('ITrajectoireRepository')
    private readonly trajectoireRepository: ITrajectoireRepository,
  ) {}

  async execute(trajectoireId: number, dto: UpdatePositionDto): Promise<Trajectoire> {
    const trajectoire = await this.trajectoireRepository.findById(trajectoireId);
    if (!trajectoire) {
      throw new NotFoundException(`Trajectoire avec l'ID ${trajectoireId} introuvable`);
    }

    if (dto.latitude < -90 || dto.latitude > 90) {
      throw new BadRequestException('Latitude invalide');
    }
    if (dto.longitude < -180 || dto.longitude > 180) {
      throw new BadRequestException('Longitude invalide');
    }

    return await this.trajectoireRepository.updatePosition(trajectoireId, dto.latitude, dto.longitude);
  }
}
