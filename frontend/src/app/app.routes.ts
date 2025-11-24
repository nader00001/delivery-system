import type { Routes } from "@angular/router"
import { DashboardComponent } from "./features/dashboard/dashboard.component"
import { TrackingComponent } from "./features/tracking/tracking.component"
import { CatalogueFormComponent } from "./features/catalogue/catalogue-form.component"
import { CatalogueListComponent } from "./features/catalogue/catalogue-list.component"
import { ClientListComponent } from "./features/client/client-list.component"
import { CamionListComponent } from "./features/camion/camion-list.component"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "tracking",
    component: TrackingComponent,
  },
  {
    path: "catalogues",
    children: [
      {
        path: "",
        component: CatalogueListComponent,
      },
      {
        path: "create",
        component: CatalogueFormComponent,
      },
      {
        path: "edit/:id",
        component: CatalogueFormComponent,
      },
    ],
  },
  {
    path: "clients",
    children: [
      {
        path: "",
        component: ClientListComponent,
      },
    ],
  },
  {
    path: "camions",
    children: [
      {
        path: "",
        component: CamionListComponent,
      },
    ],
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
]
