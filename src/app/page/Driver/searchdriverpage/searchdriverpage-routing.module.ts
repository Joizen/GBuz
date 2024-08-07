import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchdriverpageComponent } from './searchdriverpage.component';

const routes: Routes = [{ path: '', component: SearchdriverpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchdriverpageRoutingModule { }
