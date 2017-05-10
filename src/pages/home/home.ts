import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SearchPage } from '../search/search';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username = '';
  email = '';
  info: any = {};
  barcodeResult;
  options: BarcodeScannerOptions;
  constructor(private barcode: BarcodeScanner, private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, ) {
    this.info = this.auth.getUserInfo();
    console.log(' info ' + JSON.stringify(this.info));

    if (this.info == null) {
      this.showError('Please login first');
      this.nav.setRoot('LoginPage');
    }
    // this.showError(JSON.stringify(info));
  }

  async scanBarcode() {
    const results = await this.barcode.scan();
    // this.barcodeResult = results; 
    if (results.text) {
      // alert(' results ' + results.text);
      const plu_no = '0'+results.text;
      this.nav.push(SearchPage, {
        searchBy: 'scanner',
        plu_no: plu_no
      });
    }
  }

  public searchBy(search: any) {
    this.nav.push(SearchPage, {
      searchBy: search
    });
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage');
    });
  }

  showError(text) {

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}