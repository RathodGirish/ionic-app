import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { APIService } from '../../providers/api-service';
import { Http } from '@angular/http';
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
  public posObject = { item_id: '', description: '', newPrice: "", updateInventory: "", dName: "" };
  public departmentList = [];
  public descriptionList = [];
  public item: any;
  public newDescriptionList = [];
  public dName = "";
  public showList: boolean = false;
  public byScanner: boolean = false;

  public selectedItem = { "item_id": "", "plu_no": "", "price": "", "description": "" };

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, public navParams: NavParams, private http: Http, public loadingController: LoadingController, public API_SERVICE: APIService) {
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
    if (this.searchBy == 'scanner') {
      this.plu_no = this.navParams.get('plu_no');
      this.API_SERVICE.getScanneItemsByStoreId(this.info
        .store_id, this.plu_no, function (err, res) {
          if (err) {
            console.log("ERROR!: ", err);
          }
          else {
            if (res.message == null || res.message == '' || res.message == 'undefined') {
              loader.dismiss();
              alert("Sorry No Data Found !!");
              THIS.popView();
            } else {
              const b = JSON.parse(JSON.stringify(res.message));
              THIS.item = b[0];
              THIS.selectDesc(null, THIS.item);
              THIS.byScanner = true;
              loader.dismiss();
            }
          }
        });
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

  public searchDescription(ev: any) {
    let val = ev.target.value;
    this.newDescriptionList = [];

    // if the value is an empty string don't filter the descriptionList
    if (val && val.trim() != '') {
      // Filter the descriptionList
      this.newDescriptionList = this.descriptionList.filter((item) => {
        return (item.description.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });

      // Show the results
      this.showList = true;
    } else {

      // hide the results when the query is empty
      this.showList = false;
    }
  }

  public selectDesc(event: any, item: any) {
    if(event != null){
      event.stopPropagation();
    }
    this.initializeDescriptionItems();
    this.selectedItem = item;
    this.posObject.description = item.description;
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
    console.log(' pos ' + JSON.stringify(pos) + ' isValid ' + isValid);

    if (isValid) {

      // let updatePosURL = 'http://192.169.176.227/backofficeweb/?action=updateiteam&plu_no=' + pos. + '&description=' + pos.description + '&new_price=' + pos.new_rice + '&update_inventory=' + pos.update_inventory;
      let updatePosURL = 'http://192.169.176.227/backofficeweb/?action=updateiteam&item_id=' + this.selectedItem.item_id + '&new_price=' + pos.new_rice + '&update_inventory=' + pos.update_inventory;
      console.log(' updatePosURL ' + JSON.stringify(updatePosURL));
      this.http
        .get(updatePosURL)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log('updatePos data  ' + JSON.stringify(data));
          if (data.status == 1) {
            this.showSucess('POS Updated Successfully');
            this.popView();
          } else {
            this.showError('Fail to Update POS');
          }
        },
        err => {
          console.log("ERROR!: ", err);
        }
        );
    }
  }

  public popView() {
    this.nav.pop();
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