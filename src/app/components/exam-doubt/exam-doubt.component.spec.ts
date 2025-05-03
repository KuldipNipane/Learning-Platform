import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamDoubtComponent } from './exam-doubt.component';

describe('ExamDoubtComponent', () => {
  let component: ExamDoubtComponent;
  let fixture: ComponentFixture<ExamDoubtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamDoubtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamDoubtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
