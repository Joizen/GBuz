import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectvehicleplanpageComponent } from './selectvehicleplanpage.component';

const routes: Routes = [{ path: '', component: SelectvehicleplanpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectvehicleplanpageRoutingModule { }
