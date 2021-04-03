import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss'],
})
export class IngredientListComponent implements OnInit {
  ingredientsDetails = [];

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {
    this.getIngredientDetails();
  }

  getIngredientDetails() {
    this._file.getIngredientsDetails().subscribe(
      (res) => {
        console.log(res);
        this.ingredientsDetails = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
