import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpCode, 
  HttpStatus,
  ParseIntPipe 
} from '@nestjs/common';
import { CreateCatalogueDto } from '../application/dto/catalogue-creneaux/create-catalogue.dto';
import { UpdateCatalogueDto } from '../application/dto/catalogue-creneaux/update-catalogue.dto';
import { CreateCatalogueUseCase } from '../application/use-cases/catalogue-creneaux/create-catalogue.use-case';
import { ValiderCatalogueUseCase } from '../application/use-cases/catalogue-creneaux/valider-catalogue.use-case';
import { RefuserCatalogueUseCase } from '../application/use-cases/catalogue-creneaux/refuser-catalogue.use-case';
import { ICatalogueCreneauxRepository } from '../core/repository/catalogue-creneaux.repository.interface';
import { CatalogueCreneaux } from '../core/entities/catalogue_creneaux.entity';
import { Inject } from '@nestjs/common';
import { ResponsableMagasin } from 'src/core/entities/responsable-magasin.entity';

@Controller('catalogues')
export class CatalogueCreneauxController {
  constructor(
    private readonly createCatalogueUseCase: CreateCatalogueUseCase,
    private readonly validerCatalogueUseCase: ValiderCatalogueUseCase,
    private readonly refuserCatalogueUseCase: RefuserCatalogueUseCase,
    @Inject('ICatalogueCreneauxRepository')
    private readonly catalogueRepository: ICatalogueCreneauxRepository,
  ) {}

  @Get()
  async findAll(): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findAll();
  }

  @Get('disponibles')
  async findDisponibles(): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findByStatut('disponible');
  }

  @Get('statut/:statut')
  async findByStatut(@Param('statut') statut: string): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findByStatut(statut);
  }

  @Get('client/:clientId')
  async findByClientId(@Param('clientId', ParseIntPipe) clientId: number): Promise<CatalogueCreneaux[]> {
    return await this.catalogueRepository.findByClientId(clientId);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CatalogueCreneaux> {
    return await this.catalogueRepository.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCatalogueDto: CreateCatalogueDto): Promise<CatalogueCreneaux> {
    return await this.createCatalogueUseCase.execute(createCatalogueDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatalogueDto: UpdateCatalogueDto,
  ): Promise<CatalogueCreneaux> {
    return await this.catalogueRepository.update(id, updateCatalogueDto);
  }

  @Put(':id/valider')
  async valider(
    @Param('id', ParseIntPipe) id: number,
    @Body('responsableId', ParseIntPipe) responsableId: ResponsableMagasin,
  ): Promise<CatalogueCreneaux> {
    return await this.validerCatalogueUseCase.execute(id, responsableId);
  }

  @Put(':id/refuser')
  async refuser(
    @Param('id', ParseIntPipe) id: number,
    @Body('responsableId', ParseIntPipe) responsableId: ResponsableMagasin,
    @Body('raison') raison: string,
  ): Promise<CatalogueCreneaux> {
    return await this.refuserCatalogueUseCase.execute(id, responsableId, raison);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.catalogueRepository.delete(id);
  }
}
