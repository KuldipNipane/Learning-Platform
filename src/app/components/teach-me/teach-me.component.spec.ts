import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachMeComponent } from './teach-me.component';

describe('TeachMeComponent', () => {
  let component: TeachMeComponent;
  let fixture: ComponentFixture<TeachMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeachMeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
