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
import { CreateResponsableDto } from '../application/dto/responsable-magasin/create-responsable.dto';
import { UpdateResponsableDto } from '../application/dto/responsable-magasin/update-responsable.dto';
import { LoginResponsableDto } from '../application/dto/responsable-magasin/login-responsable.dto';
import { IResponsableMagasinRepository } from '../core/repository/responsable-magasin.repository.interface';
import { ResponsableMagasin } from '../core/entities/responsable-magasin.entity';
import { Inject } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

@Controller('responsables')
export class ResponsableMagasinController {
  constructor(
    @Inject('IResponsableMagasinRepository')
    private readonly responsableRepository: IResponsableMagasinRepository,
  ) {}

  @Get()
  async findAll(): Promise<ResponsableMagasin[]> {
    return await this.responsableRepository.findAll();
  }

  @Get('actifs')
  async findActifs(): Promise<ResponsableMagasin[]> {
    return await this.responsableRepository.findActifs();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ResponsableMagasin> {
    return await this.responsableRepository.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createResponsableDto: CreateResponsableDto): Promise<ResponsableMagasin> {
    // const hashedPassword = await bcrypt.hash(createResponsableDto.motDePasse, 10);
    return await this.responsableRepository.create({
      ...createResponsableDto,
      motDePasse: createResponsableDto.motDePasse,
      actif: true,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginResponsableDto): Promise<{ success: boolean; responsable?: ResponsableMagasin }> {
    try {
      const responsable = await this.responsableRepository.findByEmail(loginDto.email);
      if (!responsable || !responsable.actif) {
        return { success: false };
      }

      const isPasswordValid = await loginDto.motDePasse ===responsable.motDePasse;
      if (!isPasswordValid) {
        return { success: false };
      }

      return { success: true, responsable };
    } catch (error) {
      return { success: false };
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResponsableDto: UpdateResponsableDto,
  ): Promise<ResponsableMagasin> {
    if (updateResponsableDto.motDePasse) {
      updateResponsableDto.motDePasse = updateResponsableDto.motDePasse;
    }
    return await this.responsableRepository.update(id, updateResponsableDto);
  }

  @Put(':id/desactiver')
  async desactiver(@Param('id', ParseIntPipe) id: number): Promise<ResponsableMagasin> {
    return await this.responsableRepository.update(id, { actif: false });
  }

  @Put(':id/activer')
  async activer(@Param('id', ParseIntPipe) id: number): Promise<ResponsableMagasin> {
    return await this.responsableRepository.update(id, { actif: true });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.responsableRepository.delete(id);
  }
}