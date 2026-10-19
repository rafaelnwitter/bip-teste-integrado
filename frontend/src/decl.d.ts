declare const process: {
  env: {
    MFE_BENEFICIOS_REMOTE?: string;
  };
};

declare module 'mfeBeneficios/BeneficiosModule' {
  import { Routes } from '@angular/router';
  export const routes: Routes;
}
