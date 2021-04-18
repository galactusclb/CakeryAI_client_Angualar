import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

class uploadFileSnippet {
  pending: boolean = false;
  status: string = null;
  progress: number = 0;

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  file: File;
  selectedFile: uploadFileSnippet;

  selectedColumn: any = {};
  details = {};

  csv_header = [];
  lines: any = [];
  products = [];

  sectionDisplay: number = 0;

  http_loading: boolean = false;

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {
    this.getProductDetails();
  }

  getProductDetails() {
    this.http_loading = true;
    this._file.getProductsDetails().subscribe(
      (res) => {
        console.log(res);
        this.products = res;

        this.products.forEach((element) => {
          if (element['Ingredient']) {
            element['Ingredient'] = JSON.parse(element['Ingredient']);
            // console.log(element['Ingredient']);
          }
        });

        this.http_loading = false;
        // this.ingredientsDetails = res[0].ingredients_details;
      },
      (err) => {
        this.http_loading = false;
        console.log(err);
      }
    );
  }

  deleteproduct(productId) {
    if (
      confirm(
        'Are you sure you want to delete the product from collection? This action cannot be reversed.'
      )
    ) {
      this.http_loading = true;

      this._file.deleteproduct(productId).subscribe(
        (res) => {
          this.getProductDetails();
        },
        (err) => {
          this.http_loading = false;
          console.log(err);
        }
      );
    }
  }

  // openUpload() {
  //   this.sectionDisplay = 1;
  // }

  // processFile(imageInput: any) {
  //   this.file = null;
  //   this.selectedColumn = {};
  //   this.file = imageInput.files[0];
  //   // console.log(file);

  //   if (this.file && this.file.size > 1048576) {
  //     //  >1MB
  //     alert('Maximum upload file size is 1MB');
  //   } else if (this.file && this.file.size <= 1048576) {
  //     //for the check to an image is selected
  //     const reader = new FileReader();
  //     reader.readAsText(this.file);

  //     reader.addEventListener('load', (event: any) => {
  //       const csv = reader.result;
  //       const allTextLines = csv.toString().split(/\r|\n|\r/);
  //       this.csv_header = [];

  //       if (allTextLines[0].includes(';')) {
  //         this.csv_header = allTextLines[0].split(';');
  //       } else {
  //         this.csv_header = allTextLines[0].split(',');
  //       }

  //       this.details['header'] = this.csv_header;

  //       this.lines = [];

  //       for (let i = 1; i < allTextLines.length; i++) {
  //         // split content based on comma
  //         let data = allTextLines[i].split(',');

  //         if (data.length === this.csv_header.length) {
  //           let tarr = [];
  //           for (let j = 0; j < this.csv_header.length; j++) {
  //             tarr.push(data[j]);
  //           }
  //           this.lines.push(tarr);
  //         }
  //       }

  //       this.details['data'] = this.lines;
  //       console.log(this.details);

  //       this.sectionDisplay = 2;
  //     });

  //     // reader.readAsDataURL(file);
  //   }
  // }

  // addIngredientsDetails() {
  //   this._file.addIngredientsDetails({ ingredients: this.details }).subscribe(
  //     (res) => {
  //       console.log(res);
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  // removeFile() {
  //   document.getElementById('image-upload-section').style.display = 'block';
  //   document.getElementById('image-preview-section').style.display = 'none';

  //   this.selectedFile = null;
  // }

  // backToUpload() {
  //   this.csv_header = [];
  //   this.sectionDisplay = 0;
  // }
}
