import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChitgroupComponent } from './components/chitgroup/chitgroup.component';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { JoinedGroupsComponent } from './components/joined-groups/joined-groups.component';
import { AvailableGroupsComponent } from './components/available-groups/available-groups.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuctionviewComponent } from './auctionview/auctionview.component';
import { LotterybasedComponent } from './components/lotterybased/lotterybased.component';
import { LottingComponent } from './lotting/lotting.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path:'signup', component:SignupComponent},
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'joined-groups', component: JoinedGroupsComponent },
  { path: 'available-groups', component: AvailableGroupsComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'chits/create', component: ChitgroupComponent },
  { path: 'chits/view', component: ChitgroupComponent },
  { path: '', redirectTo: 'chits', pathMatch: 'full' },
  {path:'auction/:chitId',component:AuctionviewComponent},
  { path: 'lotterybased', component: LotterybasedComponent},
  {path:'lotting/:groupId', component:LottingComponent},
  { path: 'invoice/:id', component: InvoiceComponent },
  { path: 'invoices', component: InvoiceComponent },    



  




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


