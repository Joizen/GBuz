import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanymappageComponent } from './companymappage.component';

const routes: Routes = [{ path: '', component: CompanymappageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanymappageRoutingModule { }
