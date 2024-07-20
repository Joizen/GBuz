import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchvehiclepageComponent } from './searchvehiclepage.component';

const routes: Routes = [{ path: '', component: SearchvehiclepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchvehiclepageRoutingModule { }
