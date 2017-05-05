import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, NavParams} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
 
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  searchBy = '';
  info : any = {};
  posObject = { description: '', department: '', upcCode: '', currentPrice: '', newPrice: "", updateInventory: "" };

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, public navParams: NavParams) {
    this.info = this.auth.getUserInfo();
    console.log(' info ' + JSON.stringify(this.info));
    
    if(this.info == null){
      this.showError('Please login first');
      this.nav.setRoot('LoginPage');
    }

    this.searchBy = this.navParams.get('searchBy');
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot('LoginPage');
    });
  }

  public back(){
    // this.nav.setRoot('HomePage');
  }

  popView(){
     this.nav.pop();
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