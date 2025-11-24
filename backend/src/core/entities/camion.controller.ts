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
  ParseIntPipe,
  Inject
} from '@nestjs/common';
import { CreateCamionDto } from '../../application/dto/camion/create-camion.dto';
import { UpdateCamionDto } from '../../application/dto/camion/update-camion.dto';
import { ICamionRepository } from '../../core/repository/camion.repository.interface';
import { Camion } from '../../core/entities/camion.entity';

@Controller('api/camions')
export class CamionController {
  constructor(
    @Inject('ICamionRepository')
    private readonly camionRepository: ICamionRepository,
  ) {}

  @Get()
  async findAll(): Promise<Camion[]> {
    return await this.camionRepository.findAll();
  }

  @Get('chauffeur')
  async findByChauffeur(@Query('nom') nom: string): Promise<Camion[]> {
    return await this.camionRepository.findByChauffeur(nom);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Camion> {
    return await this.camionRepository.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCamionDto: CreateCamionDto): Promise<Camion> {
    return await this.camionRepository.create(createCamionDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCamionDto: UpdateCamionDto,
  ): Promise<Camion> {
    return await this.camionRepository.update(id, updateCamionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.camionRepository.delete(id);
  }
}
