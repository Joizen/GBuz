import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchroutepageComponent } from './searchroutepage.component';

const routes: Routes = [{ path: '', component: SearchroutepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchroutepageRoutingModule { }
