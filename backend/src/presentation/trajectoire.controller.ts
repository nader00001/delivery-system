import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe 
} from '@nestjs/common';
import { CreateTrajectoireDto } from '../application/dto/trajectoire/create-trajectoire.dto';
import { UpdateTrajectoireDto } from '../application/dto/trajectoire/update-trajectoire.dto';
import { UpdatePositionDto } from '../application/dto/trajectoire/update-position.dto';
import { CreateTrajectoireUseCase } from '../application/use-cases/trajectoire/create-trajectoire.use-case';
// import { UpdatePositionUseCase } from '../application/use-cases/trajectoire/update-position.use-case';
import { ConfirmerArriveeUseCase } from '../application/use-cases/trajectoire/confirmer-arrivee.use-case';
import { ITrajectoireRepository } from '../core/repository/trajectoire.repository.interface';
import { Trajectoire } from '../core/entities/trajectoire.entity';
import { Inject } from '@nestjs/common';
import { ResponsableMagasin } from 'src/core/entities/responsable-magasin.entity';

@Controller('trajectoires')
export class TrajectoireController {
  constructor(
    private readonly createTrajectoireUseCase: CreateTrajectoireUseCase,
    // private readonly updatePositionUseCase: UpdatePositionUseCase,
    private readonly confirmerArriveeUseCase: ConfirmerArriveeUseCase,
    @Inject('ITrajectoireRepository')
    private readonly trajectoireRepository: ITrajectoireRepository,
  ) {}

  @Get()
  async findAll(): Promise<Trajectoire[]> {
    return await this.trajectoireRepository.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Trajectoire> {
    return await this.trajectoireRepository.findById(id);
  }

  @Get('catalogue/:catalogueId')
  async findByCatalogueId(@Param('catalogueId', ParseIntPipe) catalogueId: number): Promise<Trajectoire[]> {
    return await this.trajectoireRepository.findByCatalogueId(catalogueId);
  }

  @Get('camion/:camionId')
  async findByCamionId(@Param('camionId', ParseIntPipe) camionId: number): Promise<Trajectoire | null> {
    return await this.trajectoireRepository.findByCamionId(camionId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTrajectoireDto: CreateTrajectoireDto): Promise<Trajectoire> {
    return await this.createTrajectoireUseCase.execute(createTrajectoireDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrajectoireDto: UpdateTrajectoireDto,
  ): Promise<Trajectoire> {
    return await this.trajectoireRepository.update(id, updateTrajectoireDto);
  }

//   @Put(':id/position')
//   async updatePosition(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updatePositionDto: UpdatePositionDto,
//   ): Promise<Trajectoire> {
//     return await this.updatePositionUseCase.execute(id, updatePositionDto);
//   }

  @Put(':id/confirmer-arrivee')
  async confirmerArrivee(
    @Param('id', ParseIntPipe) id: number,
    @Body('responsableId', ParseIntPipe) responsableId: ResponsableMagasin,
  ): Promise<Trajectoire> {
    return await this.confirmerArriveeUseCase.execute(id, responsableId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.trajectoireRepository.delete(id);
  }
}