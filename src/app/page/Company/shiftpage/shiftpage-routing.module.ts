import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftpageComponent } from './shiftpage.component';

const routes: Routes = [{ path: '', component: ShiftpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftpageRoutingModule { }
