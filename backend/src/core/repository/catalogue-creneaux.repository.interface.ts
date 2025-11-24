import { CatalogueCreneaux } from "../entities/catalogue_creneaux.entity";

export interface ICatalogueCreneauxRepository {
  findAll(): Promise<CatalogueCreneaux[]>;
  findById(id: number): Promise<CatalogueCreneaux | null>;
  findByClientId(clientId: number): Promise<CatalogueCreneaux[]>;
  findByStatut(statut: string): Promise<CatalogueCreneaux[]>;
  findByDateRange(dateDebut: Date, dateFin: Date): Promise<CatalogueCreneaux[]>;
  create(catalogue: Partial<CatalogueCreneaux>): Promise<CatalogueCreneaux>;
  update(id: number, catalogue: Partial<CatalogueCreneaux>): Promise<CatalogueCreneaux>;
  delete(id: number): Promise<boolean>;
}
