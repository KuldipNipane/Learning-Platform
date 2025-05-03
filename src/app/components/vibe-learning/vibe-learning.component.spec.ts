import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VibeLearningComponent } from './vibe-learning.component';

describe('VibeLearningComponent', () => {
  let component: VibeLearningComponent;
  let fixture: ComponentFixture<VibeLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VibeLearningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VibeLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
