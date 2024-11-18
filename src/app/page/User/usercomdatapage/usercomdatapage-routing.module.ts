import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsercomdatapageComponent } from './usercomdatapage.component';

const routes: Routes = [{ path: '', component: UsercomdatapageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsercomdatapageRoutingModule { }
