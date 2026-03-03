import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have default type as button', () => {
      expect(component.type).toBe('button');
    });

    it('should have default variant as primary', () => {
      expect(component.variant).toBe('primary');
    });

    it('should not be disabled by default', () => {
      expect(component.disabled).toBe(false);
    });
  });

  describe('inputs', () => {
    it('should accept type submit', () => {
      component.type = 'submit';
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.type).toBe('submit');
    });

    it('should apply variant class', () => {
      component.variant = 'danger';
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain('btn-danger');
    });

    it('should apply secondary variant class', () => {
      component.variant = 'secondary';
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain('btn-secondary');
    });

    it('should apply primary variant class by default', () => {
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain('btn-primary');
    });

    it('should set disabled attribute when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should not have disabled attribute when disabled is false', () => {
      component.disabled = false;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(false);
    });
  });

  describe('outputs', () => {
    it('should emit clicked event on button click', () => {
      fixture.detectChanges();
      const clickSpy = vi.fn();
      component.clicked.subscribe(clickSpy);

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      button.click();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit clicked event when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const clickSpy = vi.fn();
      component.clicked.subscribe(clickSpy);

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      button.click();

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('rendering', () => {
    it('should render a button element', () => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(1);
    });
  });
});
