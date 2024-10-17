import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddusercomppageComponent } from './addusercomppage.component';

const routes: Routes = [{ path: '', component: AddusercomppageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddusercomppageRoutingModule { }
