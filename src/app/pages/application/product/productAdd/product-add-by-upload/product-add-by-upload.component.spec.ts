import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddByUploadComponent } from './product-add-by-upload.component';

describe('ProductAddByUploadComponent', () => {
  let component: ProductAddByUploadComponent;
  let fixture: ComponentFixture<ProductAddByUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAddByUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddByUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
