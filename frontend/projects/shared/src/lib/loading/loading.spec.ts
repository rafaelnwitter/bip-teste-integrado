import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoadingComponent } from './loading';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should be visible by default', () => {
      expect(component.visivel).toBe(true);
    });

    it('should have default message', () => {
      expect(component.mensagem).toBe('Carregando...');
    });
  });

  describe('visibility', () => {
    it('should show loading wrapper when visible', () => {
      component.visivel = true;
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.loading-wrapper');
      expect(wrapper).toBeTruthy();
    });

    it('should hide loading wrapper when not visible', () => {
      component.visivel = false;
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.loading-wrapper');
      expect(wrapper).toBeNull();
    });
  });

  describe('message', () => {
    it('should display custom message', () => {
      component.visivel = true;
      component.mensagem = 'Aguarde...';
      fixture.detectChanges();
      const message = fixture.nativeElement.querySelector('.loading-wrapper p');
      expect(message?.textContent).toContain('Aguarde...');
    });

    it('should display default message', () => {
      component.visivel = true;
      fixture.detectChanges();
      const message = fixture.nativeElement.querySelector('.loading-wrapper p');
      expect(message?.textContent).toContain('Carregando...');
    });
  });

  describe('structure', () => {
    it('should have spinner element when visible', () => {
      component.visivel = true;
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('.spinner');
      expect(spinner).toBeTruthy();
    });

    it('should not have spinner element when not visible', () => {
      component.visivel = false;
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('.spinner');
      expect(spinner).toBeNull();
    });
  });
});
