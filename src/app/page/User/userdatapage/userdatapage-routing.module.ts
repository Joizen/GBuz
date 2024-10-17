import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserdatapageComponent } from './userdatapage.component';

const routes: Routes = [{ path: '', component: UserdatapageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserdatapageRoutingModule { }
