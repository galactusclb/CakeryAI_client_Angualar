import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictGenerateComponent } from './predict-generate.component';

describe('PredictGenerateComponent', () => {
  let component: PredictGenerateComponent;
  let fixture: ComponentFixture<PredictGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
