import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BeneficioService } from './beneficio.service';
import { CacheService } from '../cache/cache.service';
import { Beneficio, TransferRequest } from '../models/beneficio.model';

describe('BeneficioService', () => {
  let service: BeneficioService;
  let httpMock: HttpTestingController;
  let cacheService: any;

  const mockBeneficios: Beneficio[] = [
    { id: 1, nome: 'Beneficio 1', descricao: 'Desc 1', valor: 100.00, ativo: true },
    { id: 2, nome: 'Beneficio 2', descricao: 'Desc 2', valor: 200.00, ativo: true }
  ];

  const apiUrl = 'http://localhost:8085/api/v1/beneficios';

  beforeEach(() => {
    const cacheServiceSpy = {
      get: vi.fn(),
      invalidate: vi.fn(),
      invalidateByPrefix: vi.fn(),
      clear: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BeneficioService,
        { provide: CacheService, useValue: cacheServiceSpy }
      ]
    });

    service = TestBed.inject(BeneficioService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listar', () => {
    it('should use cache service to get beneficios list', () => {
      cacheService.get.mockResolvedValue(mockBeneficios as any);

      service.listar();

      expect(cacheService.get).toHaveBeenCalledWith(
        'beneficios:list',
        expect.any(Function),
        60000
      );
    });
  });

  describe('buscarPorId', () => {
    it('should use cache service to get specific beneficio', () => {
      const beneficio = mockBeneficios[0];
      cacheService.get.mockResolvedValue(beneficio as any);

      service.buscarPorId(1);

      expect(cacheService.get).toHaveBeenCalledWith(
        'beneficios:detail:1',
        expect.any(Function),
        60000
      );
    });
  });

  describe('criar', () => {
    it('should create beneficio and invalidate cache', () => {
      const newBeneficio: Beneficio = {
        id: 0,
        nome: 'Novo Beneficio',
        descricao: 'Nova desc',
        valor: 150.00,
        ativo: true
      };

      const createdBeneficio = { ...newBeneficio, id: 3 };

      service.criar(newBeneficio).subscribe(result => {
        expect(result).toEqual(createdBeneficio);
        expect(cacheService.invalidate).toHaveBeenCalledWith('beneficios:list');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBeneficio);
      req.flush(createdBeneficio);
    });

    it('should handle create errors', () => {
      const newBeneficio: Beneficio = {
        id: 0,
        nome: '',
        descricao: '',
        valor: -1,
        ativo: true
      };

      service.criar(newBeneficio).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('atualizar', () => {
    it('should update beneficio and invalidate cache', () => {
      const updatedBeneficio = { ...mockBeneficios[0], nome: 'Nome Atualizado' };

      service.atualizar(1, updatedBeneficio).subscribe(result => {
        expect(result).toEqual(updatedBeneficio);
        expect(cacheService.invalidate).toHaveBeenCalledWith('beneficios:list');
        expect(cacheService.invalidate).toHaveBeenCalledWith('beneficios:detail:1');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedBeneficio);
      req.flush(updatedBeneficio);
    });
  });

  describe('deletar', () => {
    it('should delete beneficio and invalidate cache', () => {
      service.deletar(1).subscribe(() => {
        expect(cacheService.invalidate).toHaveBeenCalledWith('beneficios:list');
        expect(cacheService.invalidate).toHaveBeenCalledWith('beneficios:detail:1');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle delete errors', () => {
      service.deletar(999).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('transferir', () => {
    it('should transfer value and invalidate related cache entries', () => {
      const transferRequest: TransferRequest = {
        fromId: 1,
        toId: 2,
        valor: 50.00
      };

      service.transferir(transferRequest).subscribe(() => {
        expect(cacheService.invalidate).toHaveBeenCalledWith('beneficios:list');
        expect(cacheService.invalidate).toHaveBeenCalledWith('beneficios:detail:1');
        expect(cacheService.invalidate).toHaveBeenCalledWith('beneficios:detail:2');
      });

      const req = httpMock.expectOne(`${apiUrl}/transferir`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(transferRequest);
      req.flush(null);
    });

    it('should handle transfer errors', () => {
      const transferRequest: TransferRequest = {
        fromId: 1,
        toId: 2,
        valor: 1000.00 // Valor maior que saldo
      };

      service.transferir(transferRequest).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(422);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/transferir`);
      req.flush('Saldo insuficiente', { status: 422, statusText: 'Unprocessable Entity' });
    });
  });

  describe('invalidateCache', () => {
    it('should call cache service invalidateByPrefix', () => {
      service.invalidateCache();
      expect(cacheService.invalidateByPrefix).toHaveBeenCalledWith('beneficios:');
    });
  });
});