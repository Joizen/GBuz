import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsercompageComponent } from './usercompage.component';

const routes: Routes = [{ path: '', component: UsercompageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsercompageRoutingModule { }
