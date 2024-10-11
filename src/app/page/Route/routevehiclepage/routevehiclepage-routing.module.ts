import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutevehiclepageComponent } from './routevehiclepage.component';

const routes: Routes = [{ path: '', component: RoutevehiclepageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutevehiclepageRoutingModule { }
