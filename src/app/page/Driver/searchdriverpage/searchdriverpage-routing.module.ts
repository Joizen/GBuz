import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchdriverPageComponent } from './searchdriverpage.component';

const routes: Routes = [{ path: '', component: SearchdriverPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchdriverpageRoutingModule { }
