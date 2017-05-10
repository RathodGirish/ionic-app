import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
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
  plu_no = '';
  info: any = {};
  posObject = { item_id: '', description: '', newPrice: "", updateInventory: "", dName: "" };
  currentPriceList = [];
  departmentList = [];
  descriptionList = [];
  descList = [];
  item: any;
  newDescriptionList = [];
  dName = "";
  currentItems: any[] = [];
  showList: boolean = false;
  byScanner: boolean = false;
  searchQuery: string = '';
  items: string[];

  selectedItem = { "item_id": "", "plu_no": "", "price": "", "description": "" };

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, public navParams: NavParams, private http: Http, public loadingController: LoadingController) {
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

    // this.GetDataByURL("http://192.169.176.227/backofficeweb/?action=cprize&store_id=" + this.info.store_id, function (err, res) {
    //   if (err) {
    //     console.log("ERROR!: ", err);
    //   } else {
    //     THIS.currentPriceList = res.message;
    //     console.log("THIS.currentPriceList " + THIS.currentPriceList);
    //   }
    // });

    let deptUrl = "http://192.169.176.227/backofficeweb/?action=department&store_id=" + parseInt(this.info
    .store_id);
    this.GetDataByURL(deptUrl, function (err, res) {
      if (err) {
        console.log("ERROR!: ", err);
      } else {
        console.log("res.message : "+JSON.stringify(res.message));
        THIS.departmentList = res.message;
        // console.log("THIS.departmentList " + JSON.stringify(THIS.departmentList));
      }
    });

    this.GetDataByURL("http://192.169.176.227/backofficeweb/?action=grocery_items&store_id=" + this.info.store_id, function (err, res) {
      if (err) {
        console.log("ERROR!: ", err);
      } else {
        THIS.descriptionList = res.message;
        // THIS.descriptionList.forEach((des) => {  // foreach statement
        //   THIS.descList.push(des.description);
        //   // console.log("des : "+JSON.stringify(des));
        // });

        //THIS.descriptionList = THIS.descList;
        //  console.log("THIS.descList" + JSON.stringify(THIS.descList));
        // console.log("THIS.descriptionList" + JSON.stringify(THIS.descriptionList));
      }
    });

    this.searchBy = this.navParams.get('searchBy');
    // alert("this.searchBy:" + this.searchBy);
    // for scnner value assing 
    if (this.searchBy == 'scanner') {
      this.plu_no = this.navParams.get('plu_no');
      // alert("plu_no :" + this.plu_no)
      this.GetDataByURL("http://192.169.176.227/backofficeweb/?action=barcode_items&store_id=" + this.info.store_id + "&plu_no=" + this.plu_no, function (err, res) {
        if (err) {
          console.log("ERROR!: ", err);
        } else {
          if (res.message == null || res.message == '' || res.message == 'undefined') {
             loader.dismiss();
             alert("Sorry No Data Found !!");
             THIS.popView();
          }
          else {
            const b = JSON.parse(JSON.stringify(res.message));
            THIS.item = b[0];
            THIS.selectedItem = b[0];
            THIS.posObject.description = b[0].description;
            let department_id = b[0].dept_id;
            // alert("department_id : "+department_id);
            // department name

            THIS.posObject.dName = THIS.getDepartmentNameByid(department_id);
            
            // THIS.posObject.dName = THIS.dName[0].department_name;
            // alert("this.posObject.dName : "+THIS.posObject.dName);
            THIS.byScanner = true;
            loader.dismiss();
          }

        }
      });
    }
    else {
      loader.dismiss();
     
    }
    this.initializeItems();
  }
  
  public getDepartmentNameByid(department_id: any){
    let THIS = this;
    let deptName = "";
    THIS.departmentList.filter((d) => {
      if(d.number == department_id){
        deptName = d.department_name;
      }
    });
    return deptName;
  }

  public searchDescription(ev: any) {
    // Reset descriptionList back to all of the items
    //this.initializeItems();

    // set val to the value of the searchbar
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
    // alert("item :"+JSON.stringify(item));
    event.stopPropagation();
    // console.log(' item ' + JSON.stringify(item));
    this.initializeItems();
    this.selectedItem = item;
    this.posObject.description = item.description;
    let department_id = item.dept_id;
    console.log("department_id :"+department_id);
    // let department_id = "590";

    // department name
    this.posObject.dName = this.getDepartmentNameByid(department_id);

    // this.posObject.dName = this.dName[0].department_name;
    // console.log("dName : "+ this.posObject.dName);
    // alert("this.posObject.dName :"+ this.posObject.dName)
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

  public initializeItems() {
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