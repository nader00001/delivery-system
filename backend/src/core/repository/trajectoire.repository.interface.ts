import { Trajectoire } from "../entities/trajectoire.entity";

export interface ITrajectoireRepository {
  findAll(): Promise<Trajectoire[]>;
  findById(id: number): Promise<Trajectoire | null>;
  findByCatalogueId(catalogueId: number): Promise<Trajectoire[]>;
  findByCamionId(camionId: number): Promise<Trajectoire | null>;
  create(trajectoire: Partial<Trajectoire>): Promise<Trajectoire>;
  update(id: number, trajectoire: Partial<Trajectoire>): Promise<Trajectoire>;
  updatePosition(id: number, latitude: number, longitude: number): Promise<Trajectoire>;
  delete(id: number): Promise<boolean>;
}