import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutepageComponent } from './routepage.component';

const routes: Routes = [{ path: '', component: RoutepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutepageRoutingModule { }
