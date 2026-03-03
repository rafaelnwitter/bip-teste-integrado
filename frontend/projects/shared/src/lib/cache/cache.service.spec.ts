import { TestBed } from '@angular/core/testing';
import { of, delay, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get method', () => {
    it('should return cached data if valid and within TTL', async () => {
      const key = 'test-key';
      const testData = { id: 1, name: 'Test' };
      const mockRequest = vi.fn().mockReturnValue(of(testData));

      // Primeira chamada - deve fazer requisição
      const result1 = await service.get(key, mockRequest, 5000).toPromise();
      expect(result1).toEqual(testData);
      expect(mockRequest).toHaveBeenCalledTimes(1);

      // Segunda chamada - deve usar cache
      const result2 = await service.get(key, mockRequest, 5000).toPromise();
      expect(result2).toEqual(testData);
      expect(mockRequest).toHaveBeenCalledTimes(1); // Não deve chamar novamente
    });

    it('should make new request if cache is expired', async () => {
      const key = 'test-key';
      const testData = { id: 1, name: 'Test' };
      const mockRequest = vi.fn().mockReturnValue(of(testData));

      // Primeira chamada com TTL muito baixo
      const result1 = await service.get(key, mockRequest, 1).toPromise();
      expect(result1).toEqual(testData);

      // Aguarda TTL expirar
      await new Promise(resolve => setTimeout(resolve, 10));

      const result2 = await service.get(key, mockRequest, 1).toPromise();
      expect(result2).toEqual(testData);
      expect(mockRequest).toHaveBeenCalledTimes(2); // Deve chamar novamente
    });

    it('should handle request errors', async () => {
      const key = 'test-key';
      const mockRequest = vi.fn().mockReturnValue(
        throwError(() => new Error('Request failed'))
      );

      try {
        await service.get(key, mockRequest, 5000).toPromise();
        expect.fail('Should not succeed');
      } catch (error: any) {
        expect(error.message).toBe('Request failed');
        expect(mockRequest).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('invalidate method', () => {
    it('should remove specific cache entry', async () => {
      const key = 'test-key';
      const testData = { id: 1, name: 'Test' };
      const mockRequest = vi.fn().mockReturnValue(of(testData));

      // Adiciona ao cache
      await service.get(key, mockRequest, 5000).toPromise();
      expect(mockRequest).toHaveBeenCalledTimes(1);

      // Invalida cache
      service.invalidate(key);

      // Nova chamada deve fazer requisição
      await service.get(key, mockRequest, 5000).toPromise();
      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('invalidateByPrefix method', () => {
    it('should remove all entries with matching prefix', async () => {
      const testData = { id: 1, name: 'Test' };
      const mockRequest = vi.fn().mockReturnValue(of(testData));

      const key1 = 'beneficios:list';
      const key2 = 'beneficios:detail:1';
      const key3 = 'other:data';

      // Adiciona múltiplas entradas ao cache
      await service.get(key1, mockRequest, 5000).toPromise();
      await service.get(key2, mockRequest, 5000).toPromise();
      await service.get(key3, mockRequest, 5000).toPromise();
      expect(mockRequest).toHaveBeenCalledTimes(3);

      // Invalida por prefixo
      service.invalidateByPrefix('beneficios:');

      // Apenas as chaves com prefixo devem ser invalidadas
      await service.get(key1, mockRequest, 5000).toPromise(); // +1
      await service.get(key2, mockRequest, 5000).toPromise(); // +1
      await service.get(key3, mockRequest, 5000).toPromise(); // 0 (cached)
      expect(mockRequest).toHaveBeenCalledTimes(5); // +2 para beneficios, +0 para other
    });
  });

  describe('clear method', () => {
    it('should remove all cache entries and in-flight requests', async () => {
      const testData = { id: 1, name: 'Test' };
      const mockRequest = vi.fn().mockReturnValue(of(testData));

      await service.get('key1', mockRequest, 5000).toPromise();
      await service.get('key2', mockRequest, 5000).toPromise();
      expect(mockRequest).toHaveBeenCalledTimes(2);

      service.clear();

      await service.get('key1', mockRequest, 5000).toPromise();
      await service.get('key2', mockRequest, 5000).toPromise();
      expect(mockRequest).toHaveBeenCalledTimes(4); // Deve fazer novas requisições
    });
  });
});