import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent implements OnInit {
  details = {};
  ingredientDetails = { ingredients_details: '' };

  ingredients = [];
  ingredientsList = [];

  http_loading: boolean = false;
  success: boolean = false;
  edit: boolean = false;
  notFound: boolean = false;

  productId: number;
  productName: any;

  constructor(
    private Activatedroute: ActivatedRoute,
    private router: Router,
    private _file: FileUploadService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.Activatedroute.queryParams.subscribe((queryParams) => {
      console.log(queryParams);

      this.edit = queryParams['edit'];
    });

    // this.Activatedroute.url.subscribe((urlSegments) => {
    //   console.log(urlSegments);

    // console.log(this.activatedRoute.snapshot.params);
    // console.log(this.activatedRoute.snapshot.queryParams);
    // });

    this.getProductsDetails();
    this.getIngredientList();
  }

  getProductsDetails() {
    this.http_loading = true;

    this._file.getProductDetailsByProduct(this.productId).subscribe(
      (res) => {
        if (res.length == 0) {
          this.notFound = true;
        } else {
          this.details = res[0];

          if (this.details['Ingredient']) {
            this.details['Ingredient'] = JSON.parse(this.details['Ingredient']);
            this.ingredients = this.details['Ingredient'] || [];
          }
          console.log(this.details);
        }

        this.http_loading = false;
      },
      (err) => {
        console.log(err);
        this.http_loading = false;
      }
    );
  }

  getIngredientList() {
    this._file.getIngredientsDetails().subscribe(
      (res) => {
        console.log(res);

        this.ingredientsList = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeSelect() {
    this.ingredientsList.forEach((element) => {
      if (
        element['ingredients_details'] ==
        this.ingredientDetails['ingredients_details']
      ) {
        this.ingredientDetails['_ingredientID'] = element['_id'];
        this.ingredientDetails['measure_type'] = element['measure_type'];
      }
    });
  }

  addNewLine() {
    this.ingredients.push(this.ingredientDetails);
    this.ingredientDetails = { ingredients_details: '' };
    // this.ingredientDetails['ingredients_details'] = null;
    console.log(this.ingredients);
  }

  removeItem(no: number) {
    if (this.ingredients.length > 0) {
      this.ingredients.splice(no, 1);
    }
  }

  updateProduct() {
    console.log(this.details);
    this.http_loading = true;

    this.details['ingredient'] = this.ingredients;

    this._file.updateproduct(this.details).subscribe(
      (res) => {
        console.log(res);
        this.getProductsDetails();
        this.removeQueryparamsFromURL();
        this.http_loading = false;
      },
      (err) => {
        console.log(err);
        this.http_loading = false;
      }
    );
  }

  deleteproduct() {
    if (
      confirm(
        'Are you sure you want to delete the product from collection? This action cannot be reversed.'
      )
    ) {
      this._file.deleteproduct(this.productId).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  removeQueryparamsFromURL() {
    this.router.navigate([], {
      queryParams: {},
    });
  }
}
