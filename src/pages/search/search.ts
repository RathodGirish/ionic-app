import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { APIService } from '../../providers/api-service';
// import { GLOBAL_VARIABLE } from '../../providers/constant';
import { Http } from '@angular/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  public searchBy = '';
  public plu_no = '';
  public info: any = {};
  public posObject = { item_id: '', description: '', newPrice: "", updateInventory: "", dName: "", plu_no: "" };
  public departmentList = [];
  public descriptionList = [];
  public UPCList = [];
  public item: any;
  public newDescriptionList = [];
  public dName = "";
  public showList: boolean = false;
  public byScanner: boolean = false;

  public selectedItem = { "item_id": "", "plu_no": "", "price": "", "description": "" };

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, public navParams: NavParams, private http: Http, public loadingController: LoadingController, public API_SERVICE: APIService, private barcode: BarcodeScanner) {
    let THIS = this;
    this.info = this.auth.getUserInfo();
    console.log(' info ' + JSON.stringify(this.info));

    let loader = THIS.loadingController.create({
      content: "Please wait..."
    });
    loader.present();
    if (this.info == null) {
      this.showError('Please login first');
      this.nav.setRoot('LoginPage');
    }

    this.API_SERVICE.getDepartmentsByStoreId(parseInt(this.info
      .store_id), function (err, res) {
        if (err) {
          console.log("ERROR!: ", err);
        }
        else {
          console.log("res Department :" + res);
          THIS.departmentList = res.message;
        }
      }); 

    this.API_SERVICE.getGroceryItemsByStoreId(this.info
      .store_id, function (err, res) {
        if (err) {
          console.log("ERROR!: ", err);
        }
        else {
          console.log("res Items :" + res);
          THIS.descriptionList = res.message;
        }
      });

    this.searchBy = this.navParams.get('searchBy');

    // for scnner value assign
    if (this.searchBy == 'Barcode') {
      loader.dismiss();

    } else {
      loader.dismiss();
    }
    this.initializeDescriptionItems();
  }

  public getDepartmentNameByid(department_id: any) {
    let THIS = this;
    let deptName = "";
    THIS.departmentList.filter((d) => {
      if (d.number == department_id) {
        deptName = d.department_name;
      }
    });
    return deptName;
  }

  public searchDescription(ev: any, searchBy: any) {
    let val = ev.target.value;
    let THIS = this;
    // Show the results
    this.showList = true;

    // if the value is an empty string don't filter the descriptionList
    if (val && val.trim() != '') {
      console.log("descriptionList :" + THIS.descriptionList);
      // Filter the descriptionList 
      this.newDescriptionList = THIS.descriptionList.filter((item) => {
        if (searchBy == 'Barcode') {
          console.log("searchBy :" + searchBy);
          return (item.plu_no.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        else {
          return (item.description.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
      });

    } else {
      // hide the results when the query is empty
      this.showList = false;
    }
  }

  public selectDesc(event: any, item: any, searchBy: any) {
    if (event != null) {
      event.stopPropagation();
    }
    this.initializeDescriptionItems();
    this.selectedItem = item;
    if (searchBy == 'Barcode') {
      this.posObject.plu_no = item.plu_no;
    }
    else {
      this.posObject.description = item.description;
    }

    let department_id = item.dept_id;
    console.log("department_id :" + department_id);

    // department name
    this.posObject.dName = this.getDepartmentNameByid(department_id);
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage');
    });
  }

  public GetDataByURL(url, callback) {
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(
      data => {
        // console.log('response data  ' + JSON.stringify(data));
        callback(null, data);
      },
      err => {
        callback(err, null);
        console.log("ERROR!: ", err);
      });
  }

  public sendToPOS(event: any, pos: any, isValid: boolean) {
    event.preventDefault();
    let THIS = this;
    console.log(' pos ' + JSON.stringify(pos) + ' isValid ' + isValid);
    if (isValid) {
      this.API_SERVICE.updateItem(this.selectedItem.item_id, pos.new_rice, pos.update_inventory, function (err, res) {
        if (err) {
          console.log("ERROR!: ", err);
          THIS.showError('ERROR!: ' + err);
        }
        else {
          if (res.status == 1) {
            THIS.showSucess('POS Updated Successfully');
            THIS.nav.setRoot('PricebookPage');
          } else {
            THIS.showError('Fail to Update POS');
          }
        }
      });
    }
  }

  async scanBarcode(search: any) {
    const results = await this.barcode.scan();
    alert("search :" + search);
    if (results.text) {
      const plu_no = '0' + results.text;
      this.nav.setRoot(SearchPage, {
        searchBy: search,
        plu_no: plu_no
      });
    }
  }

  public initializeDescriptionItems() {
    this.newDescriptionList = [];
  }

  public showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  public showSucess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}