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
  products = [];
  csvFile = [];

  cakes = {
    c00001: 114,
  };

  modelInfo = {};

  minMonth: String;
  maxMonth: String;

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {
    this.getActivatedModelDetails();
    this.getProductsDetails();
    this.getIngredientDetails();
    this.minMonth = moment().format('YYYY-MM');
    this.maxMonth = moment().add(3, 'month').format('YYYY-MM');

    console.log(moment().format('YYYY'));

    // new Chart('myChart', {
    //   type: 'bar',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [
    //       {
    //         label: '# of Votes',
    //         data: [12, 19, 3, 5, 2, 3],
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.2)',
    //           'rgba(54, 162, 235, 0.2)',
    //           'rgba(255, 206, 86, 0.2)',
    //           'rgba(75, 192, 192, 0.2)',
    //           'rgba(153, 102, 255, 0.2)',
    //           'rgba(255, 159, 64, 0.2)',
    //         ],
    //         borderColor: [
    //           'rgba(255,99,132,1)',
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255, 206, 86, 1)',
    //           'rgba(75, 192, 192, 1)',
    //           'rgba(153, 102, 255, 1)',
    //           'rgba(255, 159, 64, 1)',
    //         ],
    //         borderWidth: 1,
    //       },
    //     ],
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [
    //         {
    //           ticks: {
    //             beginAtZero: true,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // });

    this.displayChart();
  }

  displayChart() {
    // https://cakery-ai-s3.s3-ap-southeast-1.amazonaws.com/CakeMonthlySaleReport.csv

    this._file.readCSVFileFromAWS().subscribe(
      async (res) => {
        const labels = [];
        const data = [];
        // console.log(res);

        // const gg = JSON.parse(res);
        // console.log(res);

        // res.forEach((element) => {
        //   console.log(element[0]);
        // });
        // csvFile = res;
        const gg = [];
        await csv()
          .fromString(res)
          .subscribe(function (jsonObj) {
            //single json object will be emitted for each csv line
            // parse each json asynchronousely
            // this.csvFile.push(jsonObj);
            gg.push(jsonObj);
            // console.log(gg);
          });
        // console.log(gg);
        gg.forEach((element) => {
          if (moment(element['Month']).format('YYYY') == '2020') {
            labels.push(element['Month']);
            data.push(element['Sales']);
          }
        });

        console.log(labels);
        console.log(data);

        this.generateChart(labels, data);

        this._file.getPredictonsByMonth().subscribe(
          (res) => {
            console.log(res);
            // get next 12 months
            let months = [];
            let monthsRequired = 4;

            console.log(labels[labels.length - 1]);
            const lastMonth = labels[labels.length - 1];

            for (let i = 1; i <= monthsRequired; i++) {
              months.push(
                moment(lastMonth).add(i, 'months').format('YYYY-MM-01')
              );
            }

            console.log(months);
            labels.push(...months);

            const predictedDate = [];

            // data.forEach((element) => {
            //   predictedDate.push(null);
            // });

            for (let i = 0; i < data.length; i++) {
              if (i == data.length - 1) {
                predictedDate.push(data[i]);
              } else {
                predictedDate.push(null);
              }
            }

            console.log(predictedDate);

            predictedDate.push(...res);

            this.generateChart(labels, data, predictedDate);
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  generateChart(labels, sales, sales2 = []) {
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
  }

  getActivatedModelDetails() {
    this._file.getActivatedModelDetails().subscribe(
      (res) => {
        this.modelInfo = res[0];
        console.log(this.modelInfo);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getIngredientDetails() {
    this._file.getIngredientsDetails().subscribe(
      (res) => {
        // console.log(res);
        this.ingredientsDetails = this.calc(res[0].ingredients_details);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getProductsDetails() {
    this._file.getProductsDetails().subscribe(
      (res) => {
        this.products = res['data'];
        console.log(this.products);
      },
      (err) => {
        console.log(err);
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
}
