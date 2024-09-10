import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutecomppageComponent } from './routecomppage.component';

const routes: Routes = [{ path: '', component: RoutecomppageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutecomppageRoutingModule { }
