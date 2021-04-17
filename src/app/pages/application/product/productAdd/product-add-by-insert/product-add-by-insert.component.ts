import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-add-by-insert',
  templateUrl: './product-add-by-insert.component.html',
  styleUrls: ['./product-add-by-insert.component.scss'],
})
export class ProductAddByInsertComponent implements OnInit {
  detials = {};
  ingredients = [];
  ingredientDetails = {};

  constructor() {}

  ngOnInit(): void {}

  addNewLine() {
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

  saveProduct() {
    this.detials['ingredients'] = this.ingredients;
    console.log(this.detials);
  }
}
