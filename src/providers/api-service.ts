import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GLOBAL_VARIABLE } from './constant';
 
@Injectable()
export class APIService {
 constructor(@Inject(Http) private http: Http) { }
 
  public getDepartmentsByStoreId(storeId, callback) {
    if (storeId === null) {
      return Observable.throw("Please pass store ID");
    } else {
      this.http
        .get(""+GLOBAL_VARIABLE.BASE_API_URL+"?action=department&store_id=" + storeId)
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
        .get(""+GLOBAL_VARIABLE.BASE_API_URL+"?action=grocery_items&store_id=" + storeId)
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
        .get(""+GLOBAL_VARIABLE.BASE_API_URL+"?action=barcode_items&store_id=" + storeId + "&plu_no=" + plu_no)
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
 
 public updateItem(itemId, price,inventory, callback) {
    if (itemId === null) {
      return Observable.throw("Please pass item ID");
    }  
   else if (price === null) {
      return Observable.throw("Please pass price");
    } 
   else if (inventory === null) {
      return Observable.throw("Please pass inventory");
    } 
    else {
      this.http
        .get(""+GLOBAL_VARIABLE.BASE_API_URL+"?action=updateiteam&item_id=" + itemId + "&new_price=" + price+ "&update_inventory=" + inventory)
        .map(res => res.json())
        .subscribe(
        data => { 
          return callback(null, data);
        },
        err => {
          return callback(err, null);
        });
    }
  } 
}


