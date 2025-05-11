import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OrderDeliveryComponent } from './pages/order-delivery/order-delivery.component';
import { authGuard } from './core/guards/auth.guards';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create', component: OrderDeliveryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
