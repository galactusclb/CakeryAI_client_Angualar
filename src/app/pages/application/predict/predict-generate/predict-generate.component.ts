import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import * as csv from 'csvtojson';
// var csv = require("csvtojson");

@Component({
  selector: 'app-predict-generate',
  templateUrl: './predict-generate.component.html',
  styleUrls: ['./predict-generate.component.scss'],
})
export class PredictGenerateComponent implements OnInit {
  ingredientsDetails = [];
  ingredientsList = [];
  products = [];
  csvFile = [];

  pinnedCakeList = [];

  totalReports: number = 0;

  httpLoading_chart: boolean = false;
  httpLoading_summary: any = {};

  cakes = {
    c00001: 114,
  };

  modelInfo = {};

  minMonth: String;
  maxMonth: String;

  selectedProduct: any;
  monthsCount: number = 2;

  error_chart: any;

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {
    this.getActivatedModelDetails();
    this.getProductsDetails();
    this.getIngredientDetails();
    this.minMonth = moment().format('YYYY-MM');
    this.maxMonth = moment().add(3, 'month').format('YYYY-MM');
    this.getUploadedReportsByUserId();
  }

  displayChart(productID) {
    this.httpLoading_chart = true;

    console.log('Mapped : ' + productID + ' : ');
    if (!this.checkproductInActivatedReport(productID)) {
      this.httpLoading_chart = false;
      this.generateChart([], [], []);
    } else {
      this._file.getPreviousSalesWithPredict(productID).subscribe(
        async (res) => {
          console.log(res);

          let labels = res['labels'] || [];
          let data = res['data'] || [];

          this._file
            .getPredictonsByMonth(productID, this.monthsCount)
            .subscribe(
              (res) => {
                // get next 12 months
                console.log(res);

                let months = [];
                let monthsRequired = this.monthsCount;

                const lastMonth = labels[labels.length - 1];

                for (let i = 1; i <= monthsRequired; i++) {
                  months.push(
                    moment(lastMonth).add(i, 'months').format('YYYY-MM-01')
                  );
                }

                labels.push(...months);

                const predictedDate = [];

                for (let i = 0; i < data.length; i++) {
                  if (i == data.length - 1) {
                    predictedDate.push(data[i]);
                  } else {
                    predictedDate.push(null);
                  }
                }

                predictedDate.push(...res);

                this.generateChart(labels, data, predictedDate);
              },
              (err) => {
                console.log(err);
                if (err.status == 400) {
                  this.error_chart = {
                    text_p: 'Mapped Error',
                    text_span:
                      'you should need to add products before get the prediction',
                    btn_lable: 'Go to Files',
                    route: '/app/train',
                  };
                } else if (err.status == 500) {
                  this.error_chart = {
                    text_p: 'Mapped Error',
                    text_span: 'Something wend wrong. contact support',
                    btn_lable: '',
                  };
                }

                console.log(this.error_chart);

                // var canvas = document.getElementById('myChart');

                // if (canvas) {
                //   while (canvas.firstChild) {
                //     canvas.firstChild.remove();
                //   }
                // }
                this.httpLoading_chart = false;
              }
            );
        },
        (err) => {
          console.log(err);
          // alert('sas');
          this.error_chart = {
            text_p: 'Something went wrong',
            text_span: 'Try again later',
            btn_lable: '',
          };
          this.generateChart([], [], []);
          this.httpLoading_chart = false;
        }
      );
    }
  }

  generateChart(labels, sales, sales2) {
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Sales',
          backgroundColor: 'rgba(227, 170, 65, 0.2)',
          borderColor: 'rgba(227, 170, 65, 0.5)',
          pointBackgroundColor: 'rgba(227, 170, 65, 0.8)',
          data: sales,
        },
        {
          label: 'Predict',
          backgroundColor: 'rgba(185, 20, 47, 0.2)',
          borderColor: 'rgba(185, 20, 47, 0.5)',
          pointBackgroundColor: 'rgba(185, 20, 47, 0.8)',
          data: sales2,
        },
      ],
    };

    const chartOptions = {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 80,
          fontColor: 'black',
        },
      },
    };

    new Chart('myChart', {
      type: 'line',
      data: data,
      options: chartOptions,
    });

    this.httpLoading_chart = false;
  }

  getActivatedModelDetails() {
    this.httpLoading_summary['activeReport'] = {
      loading: true,
    };

    this._file.getActivatedModelDetails().subscribe(
      (res) => {
        this.modelInfo = res[0];
        console.log(this.modelInfo);

        if (this.modelInfo?.['headers']) {
          this.modelInfo['headers'] = JSON.parse(this.modelInfo?.['headers']);

          this.modelInfo['headers'].forEach((product) => {
            if (product['mappedProductID'] != 'Month') {
              product['productName'] = this.getMappedProductName(
                product['mappedProductID']
              );
              this.pinnedCakeList.push(product);

              // // set mapped product name for csv column products
              // this.pinnedCakeList.forEach((product) => {
              //   product['productName'] = this.getMappedProductName(
              //     product['mappedProductID']
              //   );
              // });
            }
          });
        }

        console.log('pinned cakes', this.pinnedCakeList);

        this.httpLoading_summary['activeReport'] = {
          loading: false,
        };
      },
      (err) => {
        console.log(err);
        this.httpLoading_summary['activeReport'] = {
          loading: false,
        };
      }
    );
  }

  getIngredientDetails() {
    this.httpLoading_summary['ingredients'] = {
      loading: true,
    };

    this._file.getIngredientsDetails().subscribe(
      (res) => {
        console.log(res);
        this.ingredientsList = res;
        this.httpLoading_summary['ingredients'] = {
          loading: false,
        };
        // this.ingredientsDetails = this.calc(res[0].ingredients_details);
      },
      (err) => {
        console.log(err);
        this.httpLoading_summary['ingredients'] = {
          loading: false,
        };
      }
    );
  }

  getProductsDetails() {
    this.httpLoading_chart = true;
    // for loading effect
    this.httpLoading_summary['products'] = {
      loading: true,
    };

    this._file.getProductsDetails().subscribe(
      async (res) => {
        this.products = res;
        console.log(res);

        if (this.products.length) {
          this.selectedProduct = this.products[0]?.['_id'];

          await this.displayChart(this.selectedProduct);
        } else {
          this.error_chart = {
            text_p: 'You do not have any products',
            text_span: 'you should need to add products before get a predict',
            btn_lable: 'Go to Products',
            route: '/app/products/new/form',
          };
          this.httpLoading_chart = false;
        }
        this.httpLoading_summary['products'] = {
          loading: false,
        };
        console.log(this.selectedProduct);
      },
      (err) => {
        console.log(err);
        this.httpLoading_summary['products'] = {
          loading: false,
        };
      }
    );
  }

  // get uploaded reports count
  getUploadedReportsByUserId() {
    this.httpLoading_summary['totalReports'] = {
      loading: true,
    };

    this._file.getuserreports().subscribe(
      (res) => {
        this.totalReports = res.length;

        this.httpLoading_summary['totalReports'] = {
          loading: false,
        };
      },
      (err) => {
        console.log(err);
        this.httpLoading_summary['totalReports'] = {
          loading: false,
        };
      }
    );
  }

  calc(ingre): [] {
    // ingre['data'].forEach((element) => {
    //   if (element[0] in this.cakes) {
    //     let newElemet = [];

    //     element.forEach((item) => {
    //       item = this.cakes[element[0]] * item * 1;
    //       console.log(item);

    //       newElemet.push(item);
    //     });
    //     element = newElemet;
    //   }

    //   // console.log(element);
    // });

    let data = ingre['data'];

    for (let i = 0; i < data.length; i++) {
      if (data[i][0] in this.cakes) {
        for (let k = 1; k < data[i].length; k++) {
          if (k == 1) {
            data[i][k] = `${data[i][k]} X ${this.cakes[data[i][0]]}  `;
          } else {
            data[i][k] = this.cakes[data[i][0]] * data[i][k] * 1 || 0;
          }
        }
      } else {
        data.splice(i, 1); // remove ingredients
      }
    }
    ingre['data'] = data;
    console.log(data);
    return ingre;
  }

  checkproductInActivatedReport(productID) {
    let mapped = false;

    this.modelInfo?.['headers'].forEach((element) => {
      if (element['mappedProductID'] == productID) {
        mapped = true;
      }
    });

    return mapped;
  }

  getMappedProductName(productID) {
    let name = '';

    this.products.forEach((element) => {
      if (element['_id'] == productID) {
        name = element['productName'];
      }
    });
    return name;
  }
}
