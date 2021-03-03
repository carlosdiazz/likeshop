import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  SERVER_URL= environment.SERVER_URL;
  constructor( private http: HttpClient){ }

  /*Aqui voy a obtener los productos del backend */
  getallProducts(){
    return this.http.get(url: this.SERVER_URL+'/products');
  }
  }

