import { Client } from "./client.model";

export interface CatalogueCreneaux {
  idCatalogue: number;
  dateDebut: Date;
  dateFin: Date;
  statut: 'disponible' | 'reserve' | 'valide' | 'refuse';
  clientId: number;
  client?: Client;
}
