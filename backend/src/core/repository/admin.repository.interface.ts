import { Admin } from "../entities/admin.entity";

export interface IAdminRepository {
  findAll(): Promise<Admin[]>;
  findById(id: number): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  create(admin: Partial<Admin>): Promise<Admin>;
  update(id: number, admin: Partial<Admin>): Promise<Admin>;
  delete(id: number): Promise<boolean>;
}