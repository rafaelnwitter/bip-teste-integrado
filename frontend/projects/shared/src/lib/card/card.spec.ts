import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CardComponent } from './card';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have empty title by default', () => {
      expect(component.title).toBe('');
    });

    it('should be active by default', () => {
      expect(component.active).toBe(true);
    });
  });

  describe('inputs', () => {
    it('should accept title input and display it', () => {
      component.title = 'Test Title';
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('.card-header h3');
      expect(header?.textContent).toContain('Test Title');
    });

    it('should not show header when title is empty', () => {
      component.title = '';
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('.card-header');
      expect(header).toBeNull();
    });

    it('should show header when title is provided', () => {
      component.title = 'My Card';
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('.card-header');
      expect(header).toBeTruthy();
    });

    it('should apply inactive class when active is false', () => {
      component.active = false;
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('.card');
      expect(card.classList.contains('inactive')).toBe(true);
    });

    it('should not apply inactive class when active is true', () => {
      component.active = true;
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('.card');
      expect(card.classList.contains('inactive')).toBe(false);
    });
  });

  describe('structure', () => {
    it('should have card-body section', () => {
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector('.card-body');
      expect(body).toBeTruthy();
    });

    it('should have card-footer section', () => {
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector('.card-footer');
      expect(footer).toBeTruthy();
    });
  });
});
