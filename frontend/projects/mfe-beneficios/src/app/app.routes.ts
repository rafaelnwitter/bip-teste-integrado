import { Routes } from '@angular/router';
import { beneficioRoutes } from './beneficio.routes';

export { beneficioRoutes as routes } from './beneficio.routes';

export const appRoutes: Routes = [
  { path: '', children: beneficioRoutes },
  { path: '**', redirectTo: '' },
];
