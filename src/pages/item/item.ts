import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { APIService } from '../../providers/api-service';

/**
 * Generated class for the Item page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class Item {
  info: any = {};
  public newPosObject = { "plu_no": '',"department":'' };
  public showList: boolean = false;
  public departmentList = [];
  public newDepartmentList = [];
  constructor(private barcode: BarcodeScanner, public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private alertCtrl: AlertController, public API_SERVICE: APIService, ) {
    let THIS = this;
    this.info = this.auth.getUserInfo();
    if (this.info == null) {
      this.showError('Please login first');
      this.navCtrl.setRoot('LoginPage');
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
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Item');
  }

  public showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }


  async scanBarcode() {
    const results = await this.barcode.scan(); 
    if (results.text) {
      this.newPosObject.plu_no = results.text;
    }
  }

  public searchDepartment(ev: any) {
    let val = ev.target.value;
    let THIS = this;
    // Show the results
    this.showList = true;

    if (val && val.trim() != '') {
      console.log("descriptionList :" + THIS.departmentList);
      this.newDepartmentList = THIS.departmentList.filter((dep) => {
        return (dep.department_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.showList = false;
    }
  }

  public selectDepartment(event: any, dep: any) {
    event.stopPropagation();
    this.initializeDepartmentList();  
    this.newPosObject.department = dep.department_name; 
  }

  public initializeDepartmentList() {
    this.newDepartmentList = [];
  }

}
