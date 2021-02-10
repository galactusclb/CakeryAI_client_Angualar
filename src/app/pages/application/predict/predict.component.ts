import { Component, OnInit } from '@angular/core';

class ImageSnippet {
  pending: boolean = false
  status: string = null
  progress: number = 0

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {

  selectedFile: ImageSnippet
  images = []
  image_preview = ''
  csv_header = []
  lines:any = []

  sectionUploading:boolean = true
  sectionMapping:boolean = false

  
  constructor() { }

  ngOnInit(): void {
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0]
    // console.log(file);

    if (file && file.size > 1048576) { //  >1MB
      alert('Maximum upload file size is 1MB')
    } else if (file && file.size <= 1048576) { //for the check to an image is selected
      const reader = new FileReader()
      reader.readAsText(file);

      

      reader.addEventListener('load', (event: any) => {

        const csv = reader.result;
        const allTextLines = csv.toString().split(/\r|\n|\r/);
        this.csv_header = []
        // console.log(this.csv_header);

        if (allTextLines[0].includes(';')) {
          this.csv_header = allTextLines[0].split(';');
        }else{
          this.csv_header = allTextLines[0].split(',');
        }
        
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
        console.log(this.lines);
        
        this.sectionUploading = false
        this.sectionMapping = true



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


        // this._imgUpload.uploadImage(file).subscribe(
        //   res => {
        //     // console.log(res)
        //     if (res.type === HttpEventType.UploadProgress) {
        //       console.log(
        //         "Upload Progess : " + Math.round((res.loaded / res.total) * 100) + "%"
        //       );
        //       this.selectedFile.progress = Math.round((res.loaded / res.total) * 100)

        //     } else if (res.type === HttpEventType.Response) {
        //       console.log(res);
        //       this.onSuccess()
        //       this.getFiles()
        //     }
        //   },
        //   err => {
        //     console.log(err);
        //     this.onError()
        //   }
        // );
      })

      // reader.readAsDataURL(file)
    }
  }

  removeFile(){
    document.getElementById('image-upload-section').style.display = 'block'
    document.getElementById('image-preview-section').style.display = 'none'

    this.selectedFile = null
  }


  backToUpload(){
    this.csv_header = []
    this.sectionUploading = true
    this.sectionMapping = false
  }

}
