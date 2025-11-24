import { Camion } from "../entities/camion.entity";

export interface ICamionRepository {
  findAll(): Promise<Camion[]>;
  findById(id: number): Promise<Camion | null>;
  findByChauffeur(chauffeur: string): Promise<Camion[]>;
  create(camion: Partial<Camion>): Promise<Camion>;
  update(id: number, camion: Partial<Camion>): Promise<Camion>;
  delete(id: number): Promise<boolean>;
}