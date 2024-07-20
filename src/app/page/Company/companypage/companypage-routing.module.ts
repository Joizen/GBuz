import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanypageComponent } from './companypage.component';

const routes: Routes = [{ path: '', component: CompanypageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanypageRoutingModule { }
