import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent implements OnInit {
  details = {};
  ingredientDetails = { ingredients_details: '' };
  modelInfo: any = {};

  ingredients = [];
  ingredientsList = [];

  http_loading: boolean = false;
  success: boolean = false;
  edit: boolean = false;
  notFound: boolean = false;

  productId: number;
  productName: any;

  prediction = {};

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
    this.getActivatedModelDetails();
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
          this.getPrediction();

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

  getActivatedModelDetails() {
    this._file.getActivatedModelDetails().subscribe(
      (res) => {
        this.modelInfo = res[0];
        console.log(this.modelInfo);

        const lastMonthDetails =
          this.modelInfo?.['lastMonthDetails'].split(',');

        this.modelInfo['lastMonth'] = moment(lastMonthDetails[0]).format(
          'MMMM YYYY'
        );
      },
      (err) => {
        console.log(err);
        // this.httpLoading_summary['activeReport'] = {
        //   loading: false,
        // };
      }
    );
  }

  getPrediction() {
    this.prediction['loading'] = true;
    this._file.getPredictonsByMonth(this.productId, 1).subscribe(
      (res) => {
        console.log(this.ingredients);
        console.log(res);
        res[0] = res[0]?.toFixed(2);
        this.prediction = {
          predict: res[0],
          loading: false,
        };
        this.calcPredictedIngredients();
      },
      (err) => {
        console.log(err);
        this.prediction['loading'] = false;

        if (err.status == 400) {
          this.prediction = {
            text_p: 'Mapped Error',
            text_span:
              'This product has not been mapped with your activated sales report',
            btn_lable: 'Go to Files',
            route: '/app/train',
          };
        } else if (err.status == 500) {
          this.prediction = {
            text_p: 'Mapped Error',
            text_span: 'Something wend wrong. contact support',
            btn_lable: '',
          };
        }
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

  calcPredictedIngredients() {
    this.ingredients.forEach((element) => {
      element['predicted'] =
        element['amount'] * 1 * this.prediction['predict'] * 1;
    });
  }

  // pro users' prediction
  getPredictionPro() {
    console.log('predicting....');

    this._file.getPredictionPro(this.productId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
