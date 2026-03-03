import { describe, it, expect } from 'vitest';
import { ButtonComponent } from './button/button';
import { CardComponent } from './card/card';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog';
import { LoadingComponent } from './loading/loading';
import { CacheService } from './cache/cache.service';
import { BeneficioService } from './services/beneficio.service';

describe('Shared Library Exports', () => {
  it('should export ButtonComponent', () => {
    expect(ButtonComponent).toBeTruthy();
  });

  it('should export CardComponent', () => {
    expect(CardComponent).toBeTruthy();
  });

  it('should export ConfirmDialogComponent', () => {
    expect(ConfirmDialogComponent).toBeTruthy();
  });

  it('should export LoadingComponent', () => {
    expect(LoadingComponent).toBeTruthy();
  });

  it('should export CacheService', () => {
    expect(CacheService).toBeTruthy();
  });

  it('should export BeneficioService', () => {
    expect(BeneficioService).toBeTruthy();
  });
});
