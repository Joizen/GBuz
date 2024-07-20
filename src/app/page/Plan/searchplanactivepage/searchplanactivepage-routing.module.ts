import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchplanactivepageComponent } from './searchplanactivepage.component';

const routes: Routes = [{ path: '', component: SearchplanactivepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchplanactivepageRoutingModule { }
