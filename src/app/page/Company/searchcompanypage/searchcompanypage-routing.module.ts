import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchcompanypageComponent } from './searchcompanypage.component';

const routes: Routes = [{ path: '', component: SearchcompanypageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchcompanypageRoutingModule { }
