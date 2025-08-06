// admin-dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    console.log('Navigating to:', route);
    this.router.navigate([route]);


  }


  // Optional: Add method to get dynamic stats if needed
  getGroupStats() {
    // You can implement API calls here to get real statistics
    return {
      activeGroups: 12,
      totalMembers: 248
    };
  }
}