import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchplanmasterpageComponent } from './searchplanmasterpage.component';

const routes: Routes = [{ path: '', component: SearchplanmasterpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchplanmasterpageRoutingModule { }
