import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
 
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'LoginPage';
 
  constructor(platform: Platform, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      splashScreen.hide();
    });
  }
}