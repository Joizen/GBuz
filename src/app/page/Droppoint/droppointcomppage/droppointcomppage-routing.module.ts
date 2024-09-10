import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DroppointcomppageComponent } from './droppointcomppage.component';

const routes: Routes = [{ path: '', component: DroppointcomppageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DroppointcomppageRoutingModule { }
