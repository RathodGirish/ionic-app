import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
 
export class User {
  id:  string;
  role_id: string;
  store_id: string;
  username: string;
  email: string;
 
  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;
 
  public login(credentials, http) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "111111" && credentials.email === "test@gmail.com");
        // this.currentUser = new User('Test', 'test@gmail.com');

        let body = new FormData();
        body.append('email', credentials.email);
        body.append('password', credentials.password);
        body.append('type', credentials.type);
        let headers = new Headers({});
        let options = new RequestOptions({ headers: headers });

        http
            .post('http://192.169.176.227/backofficeweb/', body, options)
            .map(res => res.json())
            .subscribe(
                data => {
                  console.log(data);
                  this.currentUser = data;
                  observer.next(access);
                  observer.complete();
                },
                err => {
                  console.log("ERROR!: ", err);
                }
            );
      });
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
 
  public getUserInfo() : User {
    // return this.currentUser;
    return JSON.parse(localStorage.getItem('currentUser'))
  }

  public setCurrentUser(user: any, email: string){
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