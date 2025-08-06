import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChitgroupComponent } from './components/chitgroup/chitgroup.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { JoinedGroupsComponent } from './components/joined-groups/joined-groups.component';
import { AvailableGroupsComponent } from './components/available-groups/available-groups.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuctionviewComponent } from './auctionview/auctionview.component';
import { LotterybasedComponent } from './components/lotterybased/lotterybased.component';
import { LottingComponent } from './lotting/lotting.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvoiceComponent } from './invoice/invoice.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';


@NgModule({
  declarations: [
    AppComponent,
    ChitgroupComponent,
    LoginComponent,
    UserDashboardComponent,
    JoinedGroupsComponent,
    AvailableGroupsComponent,
    AdminDashboardComponent,
    AuctionviewComponent,
    LotterybasedComponent,
    LottingComponent,
    InvoiceComponent,
    HomeComponent,
    SignupComponent,
    
  ],
  imports: [
    BrowserModule,
    MatSnackBarModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
