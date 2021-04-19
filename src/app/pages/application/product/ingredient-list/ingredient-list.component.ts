import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss'],
})
export class IngredientListComponent implements OnInit {
  ingredientsDetails = [];

  http_loading: boolean = false;

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {
    this.getIngredientDetails();
  }

  getIngredientDetails() {
    this.http_loading = true;
    this._file.getIngredientsDetails().subscribe(
      (res) => {
        console.log(res);
        this.ingredientsDetails = res;
        this.http_loading = false;
      },
      (err) => {
        console.log(err);
        this.http_loading = false;
      }
    );
  }
}
