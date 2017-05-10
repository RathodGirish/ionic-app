import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalVariable } from './constant';
 
@Injectable()
export class APIService {
 constructor(@Inject(Http) private http: Http) { }
 
  public getDepartmentsByStoreId(storeId, callback) {
    if (storeId === null) {
      return Observable.throw("Please pass store ID");
    } else {
      this.http
        .get(""+GlobalVariable.BASE_API_URL+"action=department&store_id=" + storeId)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log("department data :" + JSON.stringify(data));
          return callback(null, data);
        },
        err => {
          return callback(err, null);
        });
    }
  }

  public getGroceryItemsByStoreId(storeId, callback) {
    if (storeId === null) {
      return Observable.throw("Please pass store ID");
    } else {
      this.http
        .get(""+GlobalVariable.BASE_API_URL+"action=grocery_items&store_id=" + storeId)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log("item data :" + JSON.stringify(data));
          return callback(null, data);
        },
        err => {
          return callback(err, null);
        });
    }
  }

 public getScanneItemsByStoreId(storeId, plu_no, callback) {
    if (storeId === null) {
      return Observable.throw("Please pass store ID");
    } else {
      this.http
        .get(""+GlobalVariable.BASE_API_URL+"action=barcode_items&store_id=" + storeId + "&plu_no=" + plu_no)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log("barcode_items data :" + JSON.stringify(data));
          return callback(null, data);
        },
        err => {
          return callback(err, null);
        });
    }
  }
   
}


