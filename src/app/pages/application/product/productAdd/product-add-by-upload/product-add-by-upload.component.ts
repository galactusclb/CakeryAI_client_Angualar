import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

class uploadFileSnippet {
  pending: boolean = false;
  status: string = null;
  progress: number = 0;

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-product-add-by-upload',
  templateUrl: './product-add-by-upload.component.html',
  styleUrls: ['./product-add-by-upload.component.scss'],
})
export class ProductAddByUploadComponent implements OnInit {
  file: File;

  selectedFile: uploadFileSnippet;
  selectedColumn: any = {};

  csv_header = [];
  lines: any = [];

  sectionDisplay: number = 0;

  details = {};
  ingredientsDetails = [];

  constructor(private _file: FileUploadService) {}

  ngOnInit(): void {}

  processFile(imageInput: any) {
    this.file = null;
    this.selectedColumn = {};
    this.file = imageInput.files[0];
    // console.log(file);

    if (this.file && this.file.size > 1048576) {
      //  >1MB
      alert('Maximum upload file size is 1MB');
    } else if (this.file && this.file.size <= 1048576) {
      //for the check to an image is selected
      const reader = new FileReader();
      reader.readAsText(this.file);

      reader.addEventListener('load', (event: any) => {
        const csv = reader.result;
        const allTextLines = csv.toString().split(/\r|\n|\r/);
        this.csv_header = [];

        if (allTextLines[0].includes(';')) {
          this.csv_header = allTextLines[0].split(';');
        } else {
          this.csv_header = allTextLines[0].split(',');
        }

        this.details['header'] = this.csv_header;

        this.lines = [];

        for (let i = 1; i < allTextLines.length; i++) {
          // split content based on comma
          let data = allTextLines[i].split(',');

          if (data.length === this.csv_header.length) {
            let tarr = [];
            for (let j = 0; j < this.csv_header.length; j++) {
              tarr.push(data[j]);
            }
            this.lines.push(tarr);
          }
        }

        this.details['data'] = this.lines;
        console.log(this.details);

        this.sectionDisplay = 1;
      });

      // reader.readAsDataURL(file);
    }
  }

  addIngredientsDetails() {
    this._file.addIngredientsDetails({ ingredients: this.details }).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

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
