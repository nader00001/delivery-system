import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'catalogues',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/catalogue/catalogue-list.component').then(m => m.CatalogueListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/catalogue/catalogue-form.component').then(m => m.CatalogueFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/catalogue/catalogue-form.component').then(m => m.CatalogueFormComponent)
          }
        ]
      },
      {
        path: 'clients',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/client/client-list.component').then(m => m.ClientListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/client/client-form.component').then(m => m.ClientFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/client/client-form.component').then(m => m.ClientFormComponent)
          }
        ]
      },
      {
        path: 'camions',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/camion/camion-list.component').then(m => m.CamionListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/camion/camion-form.component').then(m => m.CamionFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/camion/camion-form.component').then(m => m.CamionFormComponent)
          }
        ]
      },
      {
        path: 'tracking',
        loadComponent: () => import('./features/tracking/tracking.component').then(m => m.TrackingComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
