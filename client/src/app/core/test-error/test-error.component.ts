import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { enviroment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent {
  baseUrl=enviroment.apiUrl;
  validationErrors: string[]=[];

  constructor(private http:HttpClient) {}

  get404Error() {
    this.http.get(this.baseUrl+ 'products/42').subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }

  get500Error() {
    this.http.get(this.baseUrl+ 'buggy/servererror').subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }

  get400Error() {
    this.http.get(this.baseUrl+ 'buggy/badrequest').subscribe({
      next: response => console.log(response),
      error: error => console.error(error)
    })
  }

  get400ValidationError() {
    this.http.get(this.baseUrl+ 'products/five').subscribe({
      next: response => console.log(response),
      error: error => {
        console.error(error);
        this.validationErrors=error.errors;
      }
    })
  }

}
