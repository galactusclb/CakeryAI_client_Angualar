import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
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

  subscriptionLevel: number;
  pro_function: boolean = false;
  productId: number;
  productName: any;

  prediction = {};

  constructor(
    private Activatedroute: ActivatedRoute,
    private router: Router,
    private _file: FileUploadService,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.Activatedroute.queryParams.subscribe((queryParams) => {
      this.edit = queryParams['edit'];
    });

    // this.getUSerSubcription();
    this.getActivatedModelDetails();
    this.getPro_functionStatus();

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
          console.log(this.details);

          if (this.details['Ingredient']) {
            this.details['Ingredient'] = JSON.parse(this.details['Ingredient']);
            this.ingredients = this.details['Ingredient'] || [];
          }

          // console.log(
          //   'has model : ',
          //   this.hasTrainingModel(this.details['_id'])
          // );

          if (this.pro_function) {
            this.getPredictionPro();
          } else {
            this.getPrediction();
          }
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

        this.modelInfo['nextMonth'] = moment(lastMonthDetails[0])
          .add(1, 'months')
          .format('MMMM YYYY');

        if (this.modelInfo?.['headers']) {
          this.modelInfo['headers'] = JSON.parse(this.modelInfo?.['headers']);
        }

        if (this.modelInfo?.['preTrainedModelURL']) {
          this.modelInfo['preTrainedModelURL'] = JSON.parse(
            this.modelInfo?.['preTrainedModelURL']
          );
        }

        this.getProductsDetails();
      },
      (err) => {
        console.log(err);
        // this.httpLoading_summary['activeReport'] = {
        //   loading: false,
        // };
      }
    );
  }

  // pro users' prediction
  getPredictionPro() {
    console.log('has model : ', this.hasTrainingModel(this.details['_id']));
    if (
      !this.hasTrainingModel(this.details['_id']) ||
      this.modelInfo['status'] != 'complete'
    ) {
      this.prediction = {
        text_p: 'No training model found',
        text_span: 'This activated sales report has not been trained yet',
        btn_lable: 'Go to Files',
        route: '/app/train',
      };
    } else {
      this.prediction['loading'] = true;
      this._file.getPredictionPro(this.productId).subscribe(
        (res) => {
          console.log(res);
          console.log(this.ingredients);
          res = res[0];
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
          } else if (err.status == 404) {
            const obj = JSON.parse(err.error);

            this.prediction = {
              text_p: obj?.['Error'],
              text_span: obj?.['message'],
              btn_lable: '',
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
  }

  // free users' prediction
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

  getUSerSubcription() {
    if (this._auth.loggedIn()) {
      const user = this._auth.getUserAuth();
      // this.subscriptionLevel = user?.subscriptionLevel;

      return user?.subscriptionLevel * 1;
    } else return 0;
  }

  getPro_functionStatus() {
    if (this.getUSerSubcription() > 0) {
      this.pro_function = this._auth.getPro_functionStatus();
    } else this.pro_function = false;
    console.log(this.pro_function);
  }

  activateProFunctions() {
    if (this.getUSerSubcription() > 0) {
      this._auth.activateProFunctions(!this.pro_function);
      this.getPro_functionStatus();
      this.getProductsDetails();
    } else {
      alert('Subscribe to a pro plan to get a more accurate prediction.');
    }
  }

  hasTrainingModel(productId) {
    console.log('cf : ', productId);

    var productName;

    for (let i = 0; i < this.modelInfo?.['headers'].length; i++) {
      if (this.modelInfo?.['headers'][i]['mappedProductID'] == productId) {
        productName = this.modelInfo?.['headers'][i]['name'];
        break;
      }
    }

    console.log(productName);

    if (this.modelInfo?.['preTrainedModelURL']) {
      for (let i = 0; i < this.modelInfo?.['preTrainedModelURL'].length; i++) {
        if (
          this.modelInfo?.['preTrainedModelURL'][i]['product'] == productName
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
