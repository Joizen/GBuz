import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchemployeepageComponent } from './searchemployeepage.component';

const routes: Routes = [{ path: '', component: SearchemployeepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchemployeepageRoutingModule { }
