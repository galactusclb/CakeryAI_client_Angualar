import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import * as moment from 'moment';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-predict-generate',
  templateUrl: './predict-generate.component.html',
  styleUrls: ['./predict-generate.component.scss'],
})
export class PredictGenerateComponent implements OnInit {
  ingredientsDetails = [];
  products = [];

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
    // this.getIngredientDetails();
    this.minMonth = moment().format('YYYY-MM');
    this.maxMonth = moment().add(3, 'month').format('YYYY-MM');

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
    const data = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          label: 'Sales',
          backgroundColor: 'rgba(227, 170, 65, 0.2)',
          borderColor: 'rgba(227, 170, 65, 0.5)',
          pointBackgroundColor: 'rgba(227, 170, 65, 0.8)',
          data: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34],
        },
        {
          label: 'Predict',
          backgroundColor: 'rgba(185, 20, 47, 0.2)',
          borderColor: 'rgba(185, 20, 47, 0.5)',
          pointBackgroundColor: 'rgba(185, 20, 47, 0.8)',
          data: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
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
