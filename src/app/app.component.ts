import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController, MenuController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth-service';
 
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage:any = 'LoginPage';
  public activePage:any;
  @ViewChild(Nav) nav: Nav;
  public info: any = {};
 
  public sidebarMenus: Array<{title: string, component: any}>;
 
  constructor(private auth: AuthService, platform: Platform, splashScreen: SplashScreen, public menuController: MenuController) {
    platform.ready().then(() => {
      splashScreen.hide();
    });

    this.info = this.auth.getUserInfo();
    // this.menuController.enable(false);
    console.log(' auth ' + JSON.stringify(auth));
    this.sidebarMenus = [
      { title: 'Update Price', component: 'PricebookPage' },
      { title: 'Add Item', component: 'Dashboard' },
      { title: 'Lottery/Lotto', component: 'Dashboard' }
    ];
    this.activePage = this.sidebarMenus[0];
  }

  public ionViewDidEnter() {
    this.menuController.swipeEnable(false, 'sideMenu');
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  public checkActive(page: any){
    return page == this.activePage;
  }
}