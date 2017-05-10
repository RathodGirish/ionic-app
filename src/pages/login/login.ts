import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  // loginCredentials = { email: 'texonoil@gmail.com', password: 'tex@123', type: 'company' };
  loginCredentials = { email: '', password: '', type: 'company' };
  typeList: any[] = [{ value: 1, text: 'option 1', checked: false }, { value: 2, text: 'option 2', checked: false }];

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private http: Http) {
   
  }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public login() {
    //  let THIS = this;
    this.showLoading();
    let body = new FormData();
    body.append('email', this.loginCredentials.email);
    body.append('password', this.loginCredentials.password);
    body.append('type', this.loginCredentials.type);
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers });
    // console.log(' this.loginCredentials ' + JSON.stringify(this.loginCredentials));
    // this.auth.login(body, function (err, res) {
    //   if (err) {
    //     alert("err :" + err);
    //   }
    //   else {
    //     if (res.status == 'Success') {
    //       THIS.auth.setCurrentUser(res.Data, this.loginCredentials.email);
    //       THIS.nav.setRoot('HomePage');
    //     } else {
    //       this.showError(res.message);
    //     }
    //   }
    // });

    this.http
      .post('http://192.169.176.227/backofficeweb/', body, options)
      .map(res => res.json())
      .subscribe(
      data => {
        console.log('login data  ' + data);
        if (data.status == 'Success') {
          this.auth.setCurrentUser(data.Data, this.loginCredentials.email);
          this.nav.setRoot('HomePage');
        } else {
          this.showError(data.message);
        }
      },
      err => {
        console.log("ERROR!: ", err);
      }
    );

  }

  public showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  public showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}