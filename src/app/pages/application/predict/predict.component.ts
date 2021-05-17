import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = null;
  progress: number = 0;

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss'],
})
export class PredictComponent implements OnInit {
  file: File;

  selectedFile: ImageSnippet;
  selectedColumn: any = {};
  images = [];
  image_preview = '';
  csv_header = [];
  lines: any = [];

  productsList = [];

  lastMonthDetails: string = '';
  lastMonth: string = ''; //to display last month from last line
  noOfRows: number = 0;

  sectionUploading: boolean = true;
  sectionMapping: boolean = false;
  sectionSuccess: boolean = false;
  success: boolean = false;
  http_loading: boolean = false;

  csv_error = {};

  constructor(private _uploadFile: FileUploadService) {}

  ngOnInit(): void {
    this.getproductsname();
  }

  getproductsname() {
    this._uploadFile.getproductsName().subscribe(
      (res) => {
        this.productsList = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

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
        const allTextLines = csv
          .toString()
          .trim()
          .split(/\r\n|\n|\r/);
        this.csv_header = [];
        // console.log(this.csv_header);

        let HeadersList = [];

        if (allTextLines[0].includes(';')) {
          HeadersList = allTextLines[0].split(';');
        } else {
          HeadersList = allTextLines[0].split(',');
        }

        // HeadersList.forEach((element) => {
        //   if (element) {

        //   }

        //   this.csv_header.push({
        //     name: element,
        //     mappedProductID: '',
        //   });
        // });
        for (let [index, element] of HeadersList.entries()) {
          // if (index == 0 && element != 'Month') {
          //   console.log(element);
          //   this.csv_error = {
          //     message:
          //       '1st column shoud be "Month".\n Please select another file',
          //   };
          //   console.log(this.csv_error);
          // }

          this.csv_header.push({
            name: element,
            mappedProductID: '',
          });
        }

        // console.log(this.csv_header);

        this.lines = [];

        for (let i = 1; i < 10; i++) {
          // split content based on comma
          let data = allTextLines[i].split(',');

          if (data.length === this.csv_header.length) {
            let tarr = [];
            for (let j = 0; j < this.csv_header.length; j++) {
              tarr.push(data[j]);
            }

            // log each row to see output
            // console.log(tarr);
            this.lines.push(tarr);
          }
        }
        // console.table(this.lines);

        const last_element = allTextLines[allTextLines.length - 1].split(',');
        this.lastMonth = last_element[0]; //get last month from last line array
        this.noOfRows = allTextLines.length;
        this.lastMonthDetails = allTextLines[allTextLines.length - 1];

        this.sectionUploading = false;
        this.sectionMapping = true;

        // for (let i = 0; i < allTextLines.length; i++) {
        //   // split content based on comma
        //   let data = allTextLines[i].split(';');
        //   if (data.length === headers.length) {
        //     let tarr = [];
        //     for (let j = 0; j < headers.length; j++) {
        //       tarr.push(data[j]);
        //     }

        //     // log each row to see output
        //     console.log(tarr);
        //     lines.push(tarr);
        //   }
        // }

        // const allTextLines = csv.split(/\r|\n|\r/);
        // const headers = allTextLines[0].split(',');
        // const lines = [];

        // this.selectedFile = new ImageSnippet(event.target.result, file)

        // this.selectedFile.pending = true
        // this.image_preview = this.selectedFile.src;
        // console.log(this.selectedFile);

        // const list = event.split('\n');
        // list.forEach( e => {
        //   console.log(e);

        // });

        // console.log(event);

        // document.getElementById('image-upload-section').style.display = 'none'
        // document.getElementById('image-preview-section').style.display = 'block'

        // this._uploadFile.uploadReport(file).subscribe(
        //   (res) => {
        //     // console.log(res)
        //     if (res.type === HttpEventType.UploadProgress) {
        //       console.log(
        //         'Upload Progess : ' +
        //           Math.round((res.loaded / res.total) * 100) +
        //           '%'
        //       );
        //       this.selectedFile.progress = Math.round(
        //         (res.loaded / res.total) * 100
        //       );
        //     } else if (res.type === HttpEventType.Response) {
        //       console.log(res);
        //       // this.onSuccess()
        //       // this.getFiles()
        //     }
        //   },
        //   (err) => {
        //     console.log(err);
        //     // this.onError()
        //   }
        // );
      });

      // reader.readAsDataURL(file);
    }
  }

  uploadReport() {
    this.http_loading = true;
    // if (confirm('Are you sure you want to upload this file ?')) {
    const formData = new FormData();

    formData.append('report', this.file);
    formData.append('headers', JSON.stringify(this.csv_header));
    formData.append('selectedColumn', JSON.stringify(this.selectedColumn));
    formData.append('lastMonthDetails', this.lastMonthDetails);

    // for (var key in this.selectedColumn) {
    //   formData.append(key, this.selectedColumn[key]);
    // }

    this._uploadFile.uploadReport(formData).subscribe(
      (res) => {
        // console.log(res)
        if (res.type === HttpEventType.UploadProgress) {
          console.log(
            'Upload Progess : ' +
              Math.round((res.loaded / res.total) * 100) +
              '%'
          );
          // this.selectedFile.progress = Math.round(
          //   (res.loaded / res.total) * 100
          // );
        } else if (res.type === HttpEventType.Response) {
          console.log(res);
          this.success = true;
          this.sectionUploading = false;
          this.sectionMapping = false;
          this.sectionSuccess = true;
          this.http_loading = false;
          // this.onSuccess()
          // this.getFiles()
        }
      },
      (err) => {
        console.log(err);
        this.http_loading = false;
        // this.onError()
      }
    );
    // }
  }

  removeFile() {
    document.getElementById('image-upload-section').style.display = 'block';
    document.getElementById('image-preview-section').style.display = 'none';

    this.selectedFile = null;
  }

  backToUpload() {
    this.csv_header = [];
    this.sectionUploading = true;
    this.sectionMapping = false;
    this.sectionSuccess = false;
  }
}
