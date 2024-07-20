import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./page/loginpage/loginpage.module').then(m => m.LoginpageModule) },
  { path: 'login', loadChildren: () => import('./page/loginpage/loginpage.module').then(m => m.LoginpageModule) },
  { path: 'register', loadChildren: () => import('./page/registerpage/registerpage.module').then(m => m.RegisterpageModule) },
  { path: 'driverdashboard', loadChildren: () => import('./page/driverdashboard/driverdashboard.module').then(m => m.DriverdashboardModule) },
  { path: 'driver', loadChildren: () => import('./page/Driver/searchdriverpage/searchdriverpage.module').then(m => m.SearchdriverpageModule) },
  { path: 'driverdata', loadChildren: () => import('./page/Driver/driverpage/driverpage.module').then(m => m.DriverpageModule) },
  { path: 'vehicle', loadChildren: () => import('./page/Vehicle/searchvehiclepage/searchvehiclepage.module').then(m => m.SearchvehiclepageModule) },
  { path: 'vehicledata', loadChildren: () => import('./page/Vehicle/vehiclepage/vehiclepage.module').then(m => m.VehiclepageModule) },
  { path: 'company', loadChildren: () => import('./page/Company/searchcompanypage/searchcompanypage.module').then(m => m.SearchcompanypageModule) },
  { path: 'companydata', loadChildren: () => import('./page/Company/companypage/companypage.module').then(m => m.CompanypageModule) },
  { path: 'route', loadChildren: () => import('./page/Route/searchroutepage/searchroutepage.module').then(m => m.SearchroutepageModule) },
  { path: 'routedata', loadChildren: () => import('./page/Route/routepage/routepage.module').then(m => m.RoutepageModule) },
  { path: 'driverregister', loadChildren: () => import('./page/Mobile/driverregisterpage/driverregisterpage.module').then(m => m.DriverregisterpageModule) },
  { path: 'drivercheckin', loadChildren: () => import('./page/Mobile/drivercheckinpage/drivercheckinpage.module').then(m => m.DrivercheckinpageModule) },
  { path: 'driverwork', loadChildren: () => import('./page/Mobile/driverworkpage/driverworkpage.module').then(m => m.DriverworkpageModule) },
  { path: 'driverworkreport', loadChildren: () => import('./page/Mobile/driverworkreportpage/driverworkreportpage.module').then(m => m.DriverworkreportpageModule) },
  { path: 'confirmjob', loadChildren: () => import('./page/Mobile/confirmjobpage/confirmjobpage.module').then(m => m.ConfirmjobpageModule) },
  { path: 'lmap', loadChildren: () => import('./lmap/lmap.module').then(m => m.LmapModule) },
  { path: 'planactive', loadChildren: () => import('./page/Plan/searchplanactivepage/searchplanactivepage.module').then(m => m.SearchplanactivepageModule) },
  { path: 'planactivedata', loadChildren: () => import('./page/Plan/planactivepage/planactivepage.module').then(m => m.PlanactivepageModule) },
  { path: 'planmaster', loadChildren: () => import('./page/Plan/searchplanmasterpage/searchplanmasterpage.module').then(m => m.SearchplanmasterpageModule) },
  { path: 'planmasterdata', loadChildren: () => import('./page/Plan/planmasterpage/planmasterpage.module').then(m => m.PlanmasterpageModule) },
  { path: 'plan', loadChildren: () => import('./page/Plan/searchplanpage/searchplanpage.module').then(m => m.SearchplanpageModule) },
  { path: 'plandata', loadChildren: () => import('./page/Plan/plandatapage/plandatapage.module').then(m => m.PlandatapageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
