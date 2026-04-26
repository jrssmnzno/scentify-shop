import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./home/admin.page').then((m) => m.AdminPage),
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
