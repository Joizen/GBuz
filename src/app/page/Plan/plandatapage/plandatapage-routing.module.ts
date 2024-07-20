import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlandatapageComponent } from './plandatapage.component';

const routes: Routes = [{ path: '', component: PlandatapageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlandatapageRoutingModule { }
