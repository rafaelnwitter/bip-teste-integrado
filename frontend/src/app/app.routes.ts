import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

const mfeBeneficiosRemote =
  process.env.MFE_BENEFICIOS_REMOTE || 'http://localhost:4201/remoteEntry.js';

const localRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./beneficios/pages/beneficio-list/beneficio-list').then(
        (m) => m.BeneficioListComponent
      ),
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./beneficios/pages/beneficio-form/beneficio-form').then(
        (m) => m.BeneficioFormComponent
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./beneficios/pages/beneficio-form/beneficio-form').then(
        (m) => m.BeneficioFormComponent
      ),
  },
];

function loadMfeRoutes(): Promise<Routes> {
  return fetch(mfeBeneficiosRemote, {
    method: 'HEAD',
    mode: 'cors',
    signal: AbortSignal.timeout(500),
  })
    .then(() =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: mfeBeneficiosRemote,
        exposedModule: './BeneficiosModule',
      }).then((m) => m.beneficioRoutes as Routes)
    )
    .catch(() => {
      console.warn('MFE mfeBeneficios unavailable, using local fallback');
      return localRoutes;
    });
}

export const routes: Routes = [
  {
    path: 'beneficios',
    loadChildren: () => loadMfeRoutes(),
  },
  {
    path: 'transferir',
    loadComponent: () =>
      import('./beneficios/pages/transferencia/transferencia').then(
        (m) => m.TransferenciaComponent
      ),
  },
  { path: '', redirectTo: 'beneficios', pathMatch: 'full' },
  { path: '**', redirectTo: 'beneficios' },
];
