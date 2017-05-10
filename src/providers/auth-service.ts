import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

export class User {
  id: string;
  role_id: string;
  store_id: string;
  username: string;
  email: string;
  constructor() {
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  constructor( @Inject(Http) private http: Http) { }

  public login(credentials: any, callback) {
    alert('credentials :'+JSON.stringify(credentials));
    alert('credentials with out json stringify :'+credentials);
    alert('credentials direct :'+credentials.email + ' pass :'+credentials.password);
    if (credentials.email === null || credentials.password === null) {
      alert("credentials empty");
      return Observable.throw("Please insert credentials");
    } else {
      let headers = new Headers({});
      let options = new RequestOptions({ headers: headers });
      this.http
        .post('http://192.169.176.227/backofficeweb/', credentials, options)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log("hello data called");
          if (data.status == 'Success') {
            callback(null, data);
          } else {
            console.log("hello null data called");
            callback(null, data);
          }
        },
        err => {
          console.log("ERROR!: ", err);
        }
        );
    }
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo(): User {
    // return this.currentUser;
    return JSON.parse(localStorage.getItem('currentUser'))
  }

  public setCurrentUser(user: any, email: string) {
    this.currentUser = user;
    this.currentUser.email = email;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      observer.next(true);
      observer.complete();
    });
  }

}