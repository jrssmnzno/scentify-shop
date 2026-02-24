import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./home/admin.page').then((m) => m.AdminPage),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
