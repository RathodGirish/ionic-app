import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    HttpModule
  ],
  exports: [
    SearchPage
  ]
})
export class SearchModule {}
