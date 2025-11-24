import { Client } from "../entities/client.entity";

export interface IClientRepository {
  findAll(): Promise<Client[]>;
  findById(id: number): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findByAdminId(adminId: number): Promise<Client[]>;
  create(client: Partial<Client>): Promise<Client>;
  update(id: number, client: Partial<Client>): Promise<Client>;
  delete(id: number): Promise<boolean>;
}