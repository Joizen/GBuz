import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteconfigpageComponent } from './routeconfigpage.component';

const routes: Routes = [{ path: '', component: RouteconfigpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteconfigpageRoutingModule { }
