import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChitgroupComponent } from './components/chitgroup/chitgroup.component';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { JoinedGroupsComponent } from './components/joined-groups/joined-groups.component';
import { AvailableGroupsComponent } from './components/available-groups/available-groups.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'joined-groups', component: JoinedGroupsComponent },
  { path: 'available-groups', component: AvailableGroupsComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'chits/create', component: ChitgroupComponent },
  { path: 'chits/view', component: ChitgroupComponent },




  { path: '', redirectTo: 'chits', pathMatch: 'full' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


