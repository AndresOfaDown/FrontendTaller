import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Welcome } from './features/welcome/welcome';
import { RegisterPage } from './features/register/register-page';
import { LoginPage } from './features/login/login-page';
import { DashboardPage } from './features/dashboard/dashboard-page';
import { authGuard } from './core/guards/auth.guard';
import { PerfilPage } from './features/perfil/perfil-page';
import { VehiculosPage } from './features/vehiculos/vehiculos-page';
import { SubscriptionComponent } from './features/subscription/subscription.component';
import { PaymentSuccessComponent } from './features/subscription/payment-success.component';
import { RegistroTallerComponent } from './features/registro-taller/registro-taller';
import { ProcesandoPagoComponent } from './features/subscription/procesando-pago.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Welcome, pathMatch: 'full' },
      // otras rutas públicas como login, register (si usan el mismo layout)
    ]
  },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: 'register', component: RegisterPage },
  { path: 'registro-taller', component: RegistroTallerComponent },
  { path: 'login', component: LoginPage },
  { path: 'perfil', component: PerfilPage, canActivate: [authGuard] },
  { path: 'vehiculos', component: VehiculosPage, canActivate: [authGuard] },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'procesando-pago', component: ProcesandoPagoComponent, canActivate: [authGuard] },
  { path: 'payment-success', component: PaymentSuccessComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];