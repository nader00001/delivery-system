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
  ParseIntPipe,
  UseFilters
} from '@nestjs/common';
import { CreateAdminDto } from '../application/dto/admin/create-admin.dto';
import { UpdateAdminDto } from '../application/dto/admin/update-admin.dto';
import { LoginAdminDto } from '../application/dto/admin/login-admin.dto';
import { CreateAdminUseCase } from '../application/use-cases/admin/create-admin.use-case';
import { GetAdminUseCase } from '../application/use-cases/admin/get-admin.use-case';
import { GetAllAdminsUseCase } from '../application/use-cases/admin/get-all-admins.use-case';
import { UpdateAdminUseCase } from '../application/use-cases/admin/update-admin.use-case';
import { DeleteAdminUseCase } from '../application/use-cases/admin/delete-admin.use-case';
import { LoginAdminUseCase } from '../application/use-cases/admin/login-admin.use-case';
import { Admin } from '../core/entities/admin.entity';

@Controller('api/admins')
export class AdminController {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly getAdminUseCase: GetAdminUseCase,
    private readonly getAllAdminsUseCase: GetAllAdminsUseCase,
    private readonly updateAdminUseCase: UpdateAdminUseCase,
    private readonly deleteAdminUseCase: DeleteAdminUseCase,
    private readonly loginAdminUseCase: LoginAdminUseCase,
  ) {}

  @Get()
  async findAll(): Promise<Admin[]> {
    return await this.getAllAdminsUseCase.execute();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Admin> {
    return await this.getAdminUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.createAdminUseCase.execute(createAdminDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginAdminDto): Promise<{ success: boolean; admin?: Admin }> {
    try {
      const admin = await this.loginAdminUseCase.execute(loginDto);
      return { success: true, admin };
    } catch (error) {
      return { success: false };
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return await this.updateAdminUseCase.execute(id, updateAdminDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteAdminUseCase.execute(id);
  }
}