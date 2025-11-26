import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
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
        loadComponent: () => import('./features/dashboard/main/main').then(m => m.Main)
      },
      {
        path: 'catalogues',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/catalogue/list/list').then(m => m.CatalogueListComponent)
          },
          // {
          //   path: 'create',
          //   loadComponent: () => import('./features/catalogue/').then(m => m.CatalogueFormComponent)
          // },
          // {
          //   path: 'edit/:id',
          //   loadComponent: () => import('./features/catalogue/catalogue-form.component').then(m => m.CatalogueFormComponent)
          // }
        ]
      },
      {
        path: 'clients',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/client/list/list').then(m => m.ClientListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/client/form/form').then(m => m.ClientFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/client/form/form').then(m => m.ClientFormComponent)
          }
        ]
      },
      {
        path: 'camions',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/camion/list/list').then(m => m.CamionListComponent)
          },
          {
            path: 'create',
            loadComponent: () => import('./features/camion/form/form').then(m => m.CamionFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/camion/form/form').then(m => m.CamionFormComponent)
          }
        ]
      },
      {
        path: 'tracking',
        loadComponent: () => import('./features/tracking/map/map').then(m => m.Map)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notification/notification').then(m => m.NotificationsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
