import type { Camion } from "./camion.model"

export interface Trajectoire {
  idTrajectoire: number
  latitudeActuelle: number
  longitudeActuelle: number
  dateArrivee?: Date
  observations?: string
  dateCreation: Date
  catalogueId: number
  camionId: number
  camion?: Camion
}
