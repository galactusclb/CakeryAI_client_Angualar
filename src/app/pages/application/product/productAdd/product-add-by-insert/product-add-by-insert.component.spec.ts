import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddByInsertComponent } from './product-add-by-insert.component';

describe('ProductAddByInsertComponent', () => {
  let component: ProductAddByInsertComponent;
  let fixture: ComponentFixture<ProductAddByInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAddByInsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddByInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
