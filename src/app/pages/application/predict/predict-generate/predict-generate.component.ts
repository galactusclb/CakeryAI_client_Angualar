import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-predict-generate',
  templateUrl: './predict-generate.component.html',
  styleUrls: ['./predict-generate.component.scss'],
})
export class PredictGenerateComponent implements OnInit {
  ingredientsDetails = [];

  cakes = {
    c00001: 114,
  };

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {
    this.getIngredientDetails();
  }

  getIngredientDetails() {
    this._file.getIngredientsDetails().subscribe(
      (res) => {
        console.log(res);
        this.ingredientsDetails = this.calc(res[0].ingredients_details);
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
