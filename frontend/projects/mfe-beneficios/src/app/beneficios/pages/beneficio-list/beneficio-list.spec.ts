import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BeneficioListComponent } from './beneficio-list';
import { BeneficioService, Beneficio } from 'shared';

describe('BeneficioListComponent (MFE)', () => {
  let component: BeneficioListComponent;
  let fixture: ComponentFixture<BeneficioListComponent>;
  let beneficioService: any;
  let router: any;

  const mockBeneficios: Beneficio[] = [
    { id: 1, nome: 'Beneficio 1', descricao: 'Desc 1', valor: 100.0, ativo: true },
    { id: 2, nome: 'Beneficio 2', descricao: 'Desc 2', valor: 200.0, ativo: false },
    { id: 3, nome: 'Beneficio 3', descricao: 'Desc 3', valor: 50.0, ativo: true },
  ];

  beforeEach(async () => {
    const beneficioServiceSpy = {
      listar: vi.fn(),
      deletar: vi.fn(),
    };
    const routerSpy = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BeneficioListComponent],
      providers: [
        { provide: BeneficioService, useValue: beneficioServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioListComponent);
    component = fixture.componentInstance;
    beneficioService = TestBed.inject(BeneficioService);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    beneficioService.listar.mockReturnValue(of(mockBeneficios));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load beneficios on init', () => {
      fixture.detectChanges();

      expect(beneficioService.listar).toHaveBeenCalled();
      expect(component.beneficios).toEqual(mockBeneficios);
      expect(component.loading).toBe(false);
    });

    it('should set loading to true initially', () => {
      expect(component.loading).toBe(true);
    });
  });

  describe('carregar method', () => {
    it('should load beneficios successfully', () => {
      component.carregar();

      expect(component.loading).toBe(false);
      expect(component.beneficios).toEqual(mockBeneficios);
      expect(component.erro).toBe('');
    });

    it('should handle loading errors', () => {
      beneficioService.listar.mockReturnValue(
        throwError(() => new Error('Load failed'))
      );

      component.carregar();

      expect(component.erro).toBe('Erro ao carregar benefícios');
      expect(component.loading).toBe(false);
    });

    it('should clear previous error messages', () => {
      component.erro = 'Previous error';

      component.carregar();

      expect(component.erro).toBe('');
    });

    it('should handle empty beneficios list', () => {
      beneficioService.listar.mockReturnValue(of([]));

      component.carregar();

      expect(component.beneficios).toEqual([]);
      expect(component.loading).toBe(false);
      expect(component.erro).toBe('');
    });
  });

  describe('onEditar method', () => {
    it('should navigate to edit page with beneficio id', () => {
      const beneficio = mockBeneficios[0];

      component.onEditar(beneficio);

      expect(router.navigate).toHaveBeenCalledWith(['/beneficios/editar', beneficio.id]);
    });
  });

  describe('onDeletar method', () => {
    it('should set delete confirmation state', () => {
      const beneficioId = 1;

      component.onDeletar(beneficioId);

      expect(component.idParaDeletar).toBe(beneficioId);
      expect(component.dialogVisivel).toBe(true);
    });
  });

  describe('confirmarDelete method', () => {
    beforeEach(() => {
      component.idParaDeletar = 1;
      component.dialogVisivel = true;
    });

    it('should delete beneficio and reload list on success', () => {
      beneficioService.deletar.mockReturnValue(of(void 0));
      beneficioService.listar.mockReturnValue(of(mockBeneficios.slice(1)));

      component.confirmarDelete();

      expect(beneficioService.deletar).toHaveBeenCalledWith(1);
      expect(component.dialogVisivel).toBe(false);
      expect(component.loading).toBe(false);
    });

    it('should handle delete errors', () => {
      beneficioService.deletar.mockReturnValue(
        throwError(() => new Error('Delete failed'))
      );

      component.confirmarDelete();

      expect(component.erro).toBe('Erro ao deletar');
      expect(component.dialogVisivel).toBe(false);
      expect(component.loading).toBe(false);
    });

    it('should do nothing if no id to delete', () => {
      component.idParaDeletar = null;

      component.confirmarDelete();

      expect(beneficioService.deletar).not.toHaveBeenCalled();
    });

    it('should reload list after successful delete', () => {
      const updatedList = mockBeneficios.slice(1);
      beneficioService.deletar.mockReturnValue(of(void 0));
      beneficioService.listar.mockReturnValue(of(updatedList));

      component.confirmarDelete();

      expect(component.beneficios).toEqual(updatedList);
      expect(component.beneficios.length).toBe(mockBeneficios.length - 1);
    });
  });

  describe('cancelarDelete method', () => {
    it('should reset delete confirmation state', () => {
      component.dialogVisivel = true;
      component.idParaDeletar = 1;

      component.cancelarDelete();

      expect(component.dialogVisivel).toBe(false);
      expect(component.idParaDeletar).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should display error message when loading fails', () => {
      beneficioService.listar.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      fixture.detectChanges();

      expect(component.erro).toBe('Erro ao carregar benefícios');
    });

    it('should display error message when delete fails', () => {
      component.idParaDeletar = 1;
      beneficioService.deletar.mockReturnValue(
        throwError(() => new Error('Delete error'))
      );

      component.confirmarDelete();

      expect(component.erro).toBe('Erro ao deletar');
    });
  });
});
