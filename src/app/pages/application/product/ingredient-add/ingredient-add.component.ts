import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-ingredient-add',
  templateUrl: './ingredient-add.component.html',
  styleUrls: ['./ingredient-add.component.scss'],
})
export class IngredientAddComponent implements OnInit {
  @ViewChild('addForm', { static: false }) public submitForm: NgForm;

  details = {};
  http_loading: boolean = false;

  alertMessage: number = 0;

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {}

  addIngredientDetails() {
    this.http_loading = true;
    this.alertMessage = 0;
    this._file.addIngredientsDetails(this.details).subscribe(
      (res) => {
        console.log(res);
        this.alertMessage = 1;
        this.http_loading = false;
        this.submitForm.reset();
      },
      (err) => {
        console.log(err);
        this.alertMessage = 2;
        this.http_loading = false;
      }
    );
  }

  closeAlert() {
    this.alertMessage = 0;
  }
}
