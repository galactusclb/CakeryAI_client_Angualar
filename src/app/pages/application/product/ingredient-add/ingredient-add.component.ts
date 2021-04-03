import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-ingredient-add',
  templateUrl: './ingredient-add.component.html',
  styleUrls: ['./ingredient-add.component.scss'],
})
export class IngredientAddComponent implements OnInit {
  details = {};

  alertMessage: number = 0;

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {}

  addIngredientDetails() {
    this.alertMessage = 0;
    this._file.addIngredientsDetails(this.details).subscribe(
      (res) => {
        console.log(res);
        this.alertMessage = 1;
      },
      (err) => {
        console.log(err);
        this.alertMessage = 2;
      }
    );
  }

  closeAlert() {
    this.alertMessage = 0;
  }
}
