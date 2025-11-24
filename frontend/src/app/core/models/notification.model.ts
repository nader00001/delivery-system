export interface Notification {
  idNotification: number
  type: "validation" | "refus" | "info" | "alerte"
  message: string
  dateEnvoi: Date
  lue: boolean
  catalogueId?: number
  responsableId: number
}
