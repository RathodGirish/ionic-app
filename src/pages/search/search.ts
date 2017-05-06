import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  searchBy = '';
  info: any = {};
  posObject = { description: '', department: '', upcCode: '', currentPrice: '', newPrice: "", updateInventory: "" };
  currentPriceList = [];
  departmentList = [];
  description: any[] = [];
  currentItems: any[] = [];
  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, public navParams: NavParams, private http: Http) {
    let THIS = this;
    this.info = this.auth.getUserInfo();
    console.log(' info ' + JSON.stringify(this.info));

    if (this.info == null) {
      this.showError('Please login first');
      this.nav.setRoot('LoginPage');
    }

    // let url = 'http://192.169.176.227/backofficeweb/?action=cprize';
    // let response = this.http.get(url).map(res => res.json());
    // console.log("response : " +  JSON.stringify(response));
    this.GetDataByURL("http://192.169.176.227/backofficeweb/?action=cprize&store_id=" + this.info.store_id, function (err, res) {
      if (err) {
        console.log("ERROR!: ", err);
      } else {
        THIS.currentPriceList = res.message;
        console.log("THIS.currentPriceList " + THIS.currentPriceList);
      }
    });

    this.GetDataByURL("http://192.169.176.227/backofficeweb/?action=department&store_id=" + this.info.store_id, function (err, res) {
      if (err) {
        console.log("ERROR!: ", err);
      } else {
        THIS.departmentList = res.message;
        console.log("THIS.departmentList " + THIS.departmentList);
      }
    });
   
    this.GetDataByURL("http://192.169.176.227/backofficeweb/?action=description&store_id=" + this.info.store_id, function (err, res) {
      if (err) {
        console.log("ERROR!: ", err);
      } else {
        THIS.description = res.message;
        console.log("THIS.departmentList " + JSON.stringify(THIS.description));
      }
    });

    this.searchBy = this.navParams.get('searchBy');
  }

  getItems(ev) {
    let val = ev.target.value;
    console.log(' val1'  + val);
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    console.log(' val'  + val);
    // this.currentItems = this.descItems.query({
    //   name: val
    // });
    // this.currentItems = this.description.filter((v) => {

    //     if (v.toLowerCase().indexOf(val.toLowerCase()) > -1) {
    //       return true;
    //       }

    //       return false;
    //     })
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

  public sendToPOS(event: any, pos: any, isValid: boolean){
    event.preventDefault();
    console.log(' pos ' + JSON.stringify(pos) + ' isValid ' + isValid);
    if(isValid){

      let updatePosURL = 'http://192.169.176.227/backofficeweb/?action=updateiteam&plu_no=' + pos.plu_no + '&description=' + pos.description + '&new_price=' + pos.new_rice + '&update_inventory=' + pos.update_inventory;
      console.log(' updatePosURL ' + JSON.stringify(updatePosURL));
      this.http
          .get(updatePosURL)
          .map(res => res.json())
          .subscribe(
              data => {
                console.log('updatePos data  ' + JSON.stringify(data));
                if(data.status == 1){
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