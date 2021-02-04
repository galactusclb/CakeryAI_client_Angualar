import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNaviComponent } from './main-navi.component';

describe('MainNaviComponent', () => {
  let component: MainNaviComponent;
  let fixture: ComponentFixture<MainNaviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainNaviComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNaviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
