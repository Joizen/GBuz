import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchuserpageComponent } from './searchuserpage.component';

const routes: Routes = [{ path: '', component: SearchuserpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchuserpageRoutingModule { }
