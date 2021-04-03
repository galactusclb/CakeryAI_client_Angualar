import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent implements OnInit {
  ingredients = [];
  details = [];

  productId: number;
  productName: any;

  constructor(
    private Activatedroute: ActivatedRoute,
    private _file: FileUploadService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.getProductsDetails();
  }

  getProductsDetails() {
    this._file.getProductDetailsByProduct(this.productId).subscribe(
      (res) => {
        // this.products = res['data'];
        this.productName = res['details'][1];

        for (let i = 2; i < res['header'].length; i++) {
          if (res['details'][i] > 0) {
            const obj = {
              ingredient: res['header'][i],
              amount: res['details'][i],
            };
            this.ingredients.push(obj);
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
