import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Lottery } from './lottery';

@NgModule({
  declarations: [
    Lottery,
  ],
  imports: [
    IonicPageModule.forChild(Lottery),
  ],
  exports: [
    Lottery
  ]
})
export class LotteryModule {}
