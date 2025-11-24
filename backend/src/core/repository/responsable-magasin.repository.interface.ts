import { ResponsableMagasin } from "../entities/responsable-magasin.entity";

export interface IResponsableMagasinRepository {
  findAll(): Promise<ResponsableMagasin[]>;
  findById(id: number): Promise<ResponsableMagasin | null>;
  findByEmail(email: string): Promise<ResponsableMagasin | null>;
  findActifs(): Promise<ResponsableMagasin[]>;
  create(responsable: Partial<ResponsableMagasin>): Promise<ResponsableMagasin>;
  update(id: number, responsable: Partial<ResponsableMagasin>): Promise<ResponsableMagasin>;
  delete(id: number): Promise<boolean>;
}