import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class Dashboard {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Dashboard');
  }

  public redirectPage(type : any){
    if(type=='priceBook'){ 
       this.navCtrl.setRoot('PricebookPage');
    }
    else if(type=='ScratchOffReadings'){

    }
  }
}
