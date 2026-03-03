import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransferenciaComponent } from './transferencia';
import { BeneficioService, Beneficio, TransferRequest } from 'shared';

describe('TransferenciaComponent (Shell)', () => {
  let component: TransferenciaComponent;
  let fixture: ComponentFixture<TransferenciaComponent>;
  let beneficioService: any;

  const mockBeneficios: Beneficio[] = [
    { id: 1, nome: 'Beneficio 1', descricao: 'Desc 1', valor: 100.0, ativo: true },
    { id: 2, nome: 'Beneficio 2', descricao: 'Desc 2', valor: 200.0, ativo: true },
    { id: 3, nome: 'Beneficio 3', descricao: 'Desc 3', valor: 50.0, ativo: true },
  ];

  beforeEach(async () => {
    const beneficioServiceSpy = {
      listar: vi.fn(),
      transferir: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TransferenciaComponent],
      providers: [
        { provide: BeneficioService, useValue: beneficioServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferenciaComponent);
    component = fixture.componentInstance;
    beneficioService = TestBed.inject(BeneficioService);
  });

  beforeEach(() => {
    beneficioService.listar.mockReturnValue(of(mockBeneficios));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load beneficios on init', () => {
    expect(beneficioService.listar).toHaveBeenCalled();
    expect(component.beneficios).toEqual(mockBeneficios);
    expect(component.loading).toBe(false);
  });

  it('should handle error when loading beneficios', () => {
    beneficioService.listar.mockReset();
    beneficioService.listar.mockReturnValue(throwError(() => new Error('Load failed')));

    component.carregarBeneficios();

    expect(component.erro).toBe('Erro ao carregar benefícios');
    expect(component.loading).toBe(false);
  });

  describe('form validation', () => {
    it('should initialize form with required validators', () => {
      expect(component.form.get('fromId')?.hasError('required')).toBe(true);
      expect(component.form.get('toId')?.hasError('required')).toBe(true);
      expect(component.form.get('valor')?.hasError('required')).toBe(true);
    });

    it('should validate minimum value', () => {
      component.form.patchValue({ valor: 0 });
      expect(component.form.get('valor')?.hasError('min')).toBe(true);

      component.form.patchValue({ valor: 0.01 });
      expect(component.form.get('valor')?.hasError('min')).toBe(false);
    });

    it('should not submit if form is invalid', () => {
      component.transferir();

      expect(beneficioService.transferir).not.toHaveBeenCalled();
    });
  });

  describe('transferir method', () => {
    beforeEach(() => {
      component.form.patchValue({
        fromId: 1,
        toId: 2,
        valor: 50,
      });
    });

    it('should prevent transfer if origin and destination are the same', () => {
      component.form.patchValue({
        fromId: 1,
        toId: 1,
        valor: 50,
      });

      component.transferir();

      expect(component.erro).toBe('Origem e destino devem ser diferentes');
      expect(beneficioService.transferir).not.toHaveBeenCalled();
    });

    it('should validate insufficient balance', () => {
      component.form.patchValue({
        fromId: 3,
        toId: 2,
        valor: 100,
      });

      component.transferir();

      expect(component.erro).toBe('Saldo insuficiente. Disponível: R$ 50.00');
      expect(beneficioService.transferir).not.toHaveBeenCalled();
    });

    it('should perform successful transfer', () => {
      beneficioService.transferir.mockReturnValue(of(void 0));
      beneficioService.listar.mockReturnValue(of(mockBeneficios));

      component.transferir();

      const expectedRequest: TransferRequest = {
        fromId: 1,
        toId: 2,
        valor: 50,
      };

      expect(beneficioService.transferir).toHaveBeenCalledWith(expectedRequest);
      expect(component.sucesso).toBe('Transferência realizada com sucesso!');
    });

    it('should reset form after successful transfer', () => {
      beneficioService.transferir.mockReturnValue(of(void 0));
      beneficioService.listar.mockReturnValue(of(mockBeneficios));

      component.transferir();

      expect(component.form.pristine).toBe(true);
    });

    it('should reload beneficios after successful transfer', () => {
      beneficioService.transferir.mockReturnValue(of(void 0));
      beneficioService.listar.mockReturnValue(of(mockBeneficios));

      component.transferir();

      // listar was called once on init + once after transfer
      expect(beneficioService.listar).toHaveBeenCalledTimes(2);
    });

    it('should handle transfer errors with objeto error body', () => {
      const errorResponse = { error: { erro: 'Saldo insuficiente no backend' } };
      beneficioService.transferir.mockReturnValue(throwError(() => errorResponse));

      component.transferir();

      expect(component.erro).toBe('Saldo insuficiente no backend');
      expect(component.loading).toBe(false);
    });

    it('should handle string error responses', () => {
      const errorResponse = { error: 'String error message' };
      beneficioService.transferir.mockReturnValue(throwError(() => errorResponse));

      component.transferir();

      expect(component.erro).toBe('String error message');
    });

    it('should handle generic errors with message', () => {
      const errorResponse = { message: 'Network error' };
      beneficioService.transferir.mockReturnValue(throwError(() => errorResponse));

      component.transferir();

      expect(component.erro).toBe('Network error');
    });

    it('should use fallback error message', () => {
      beneficioService.transferir.mockReturnValue(throwError(() => ({})));

      component.transferir();

      expect(component.erro).toBe('Erro ao realizar transferência');
    });
  });

  describe('helper methods', () => {
    it('should return correct nome for beneficio', () => {
      expect(component.getNome(1)).toBe('Beneficio 1');
      expect(component.getNome(999)).toBe('');
    });

    it('should return correct valor for beneficio', () => {
      expect(component.getValor(1)).toBe(100.0);
      expect(component.getValor(999)).toBe(0);
    });
  });

  describe('error and success message handling', () => {
    it('should clear error and set success on successful transfer', () => {
      component.erro = 'Previous error';
      component.sucesso = 'Previous success';
      component.form.patchValue({
        fromId: 1,
        toId: 2,
        valor: 50,
      });
      beneficioService.transferir.mockReturnValue(of(void 0));
      beneficioService.listar.mockReturnValue(of(mockBeneficios));

      component.transferir();

      expect(component.erro).toBe('');
      expect(component.sucesso).toBe('Transferência realizada com sucesso!');
    });
  });
});
