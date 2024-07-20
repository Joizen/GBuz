import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchplanpageComponent } from './searchplanpage.component';

const routes: Routes = [{ path: '', component: SearchplanpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchplanpageRoutingModule { }
