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
import { CreateClientDto } from '../application/dto/client/create-client.dto';
import { UpdateClientDto } from '../application/dto/client/update-client.dto';
import { CreateClientUseCase } from '../application/use-cases/client/create-client.use-case';
import { GetClientsByAdminUseCase } from '../application/use-cases/client/get-clients-by-admin.use-case';
import { IClientRepository } from '../core/repository/client.repository.interface';
import { Client } from '../core/entities/client.entity';
import { Inject } from '@nestjs/common';

@Controller('clients')
export class ClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly getClientsByAdminUseCase: GetClientsByAdminUseCase,
    @Inject('IClientRepository')
    private readonly clientRepository: IClientRepository,
  ) {}

  @Get()
  async findAll(): Promise<Client[]> {
    return await this.clientRepository.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return await this.clientRepository.findById(id);
  }

  @Get('admin/:adminId')
  async findByAdminId(@Param('adminId', ParseIntPipe) adminId: number): Promise<Client[]> {
    return await this.getClientsByAdminUseCase.execute(adminId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return await this.createClientUseCase.execute(createClientDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return await this.clientRepository.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
}