import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutepolygonpageComponent } from './routepolygonpage.component';


const routes: Routes = [{ path: '', component: RoutepolygonpageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutepolygonpageRoutingModule { 

}
