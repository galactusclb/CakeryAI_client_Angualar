import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-product-add-by-insert',
  templateUrl: './product-add-by-insert.component.html',
  styleUrls: ['./product-add-by-insert.component.scss'],
})
export class ProductAddByInsertComponent implements OnInit {
  detials = {};
  ingredientsList = [];
  ingredients = [];
  ingredientDetails = {};

  http_loading: boolean = false;
  success: boolean = false;

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {
    this.getIngredientDetails();
  }

  changeSelect() {
    // console.log(this.ingredientDetails);
    this.ingredientsList.forEach((element) => {
      if (
        element['ingredients_details'] ==
        this.ingredientDetails['ingredients_details']
      ) {
        this.ingredientDetails['_ingredientID'] = element['_id'];
        this.ingredientDetails['measure_type'] = element['measure_type'];

        console.log(this.ingredientDetails['_ingredientID']);
      }
    });

    console.log(this.ingredientDetails);
  }

  addNewLine() {
    // console.log(this.ingredientDetails);

    // this.ingredientsList.forEach((element) => {
    //   if (element['_id'] == this.ingredientDetails['_ingredientID']) {
    //     this.ingredientDetails['ingredientName'] =
    //       element['ingredients_details'];
    //   }
    // });

    // console.log(this.ingredientDetails);

    this.ingredients.push(this.ingredientDetails);
    this.ingredientDetails = {};
    console.log(this.ingredients);
  }

  removeItem(no: number) {
    // const index = this.itemDetails.indexOf(no);
    // if (index > -1) {
    if (this.ingredients.length > 0) {
      this.ingredients.splice(no, 1);
    }
    // }
  }

  getIngredientDetails() {
    this._file.getIngredientsDetails().subscribe(
      (res) => {
        console.log(res);
        this.ingredientsList = res;
        // this.ingredientsDetails = this.calc(res[0].ingredients_details);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  saveProduct() {
    this.success = false;
    this.http_loading = true;

    this.detials['ingredient'] = this.ingredients;

    this._file.addproductsdetails(this.detials).subscribe(
      (res) => {
        console.log(res);
        this.success = true;
        this.http_loading = false;
      },
      (err) => {
        console.log(err);
        this.http_loading = false;
      }
    );
  }
}
