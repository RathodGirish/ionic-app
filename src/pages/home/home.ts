import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SearchPage } from '../search/search';
 
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  username = '';
  email = '';
  info : any = {};
  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController,) {
    this.info = this.auth.getUserInfo();
    console.log(' info ' + JSON.stringify(this.info));
    
    if(this.info == null){
      this.showError('Please login first');
      this.nav.setRoot('LoginPage');
    }
    // this.showError(JSON.stringify(info));
  }

  public searchBy(search: any){
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