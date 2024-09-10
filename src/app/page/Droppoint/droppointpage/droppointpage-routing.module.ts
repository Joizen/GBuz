import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DroppointpageComponent } from './droppointpage.component';

const routes: Routes = [{ path: '', component: DroppointpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DroppointpageRoutingModule { }
