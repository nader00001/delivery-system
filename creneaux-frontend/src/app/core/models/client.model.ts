export interface Client {
  idClient: number;
  nom: string;
  entreprise?: string;
  telephone: string;
  email: string;
  adresse?: string;
  adminId: number;
}
