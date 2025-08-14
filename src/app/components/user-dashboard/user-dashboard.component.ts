import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface UserStats {
  activeGroups: number;
  totalInvestment: number;
  completedCycles: number;
  successRate: number;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  username: string = '';
  userId: string = '';
  userStats: UserStats = {
    activeGroups: 0,
    totalInvestment: 0,
    completedCycles: 0,
    successRate: 0
  };
  isLoading: boolean = true;


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get user data from localStorage
    this.username = localStorage.getItem('username') || 'User';
    this.userId = localStorage.getItem('user_id') || '';
    
    if (this.userId) {
      this.loadUserStats();
    } else {
      // Handle case where user is not properly logged in
      this.router.navigate(['/login']);
    }
  }

  navigateTo(route: string): void {
  if (route === 'invoice') {
    // Navigate to the all invoices list view
    this.router.navigate(['/invoices']);
  } else {
    // Default navigation for other pages
    this.router.navigate(['/' + route]);
  }
}


  private loadUserStats(): void {
    this.isLoading = true;
    
    // Fetch user-specific data from backend
    this.http.get<UserStats>(`/api/users/${this.userId}/stats`)
      .subscribe({
        next: (stats) => {
          this.userStats = stats;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user stats:', error);
          this.isLoading = false;
          // Set default values or show error message
          this.userStats = {
            activeGroups: 0,
            totalInvestment: 0,
            completedCycles: 0,
            successRate: 0
          };
        }
      });
  }
//     navigateToInvoices(): void {
//     this.http.get<any>(`http://localhost:8000/auctions/invoices/${this.userId}/`)
//       .subscribe({
//         next: (res) => {
//           this.userInvoices = res.invoices || [];
//         },
//         error: (err) => {
//           console.error('Error fetching invoices:', err);
//           this.userInvoices = [];
//         }
//       });
//   }
//   navigateToInvoicePage(): void {
//   const userId = this.userId; // from localStorage
//   this.router.navigate(['/invoices/user', this.userId]);
// }

//   navigateToInvoicePage(): void {
//     console.log('User ID',this.userId);
//   // this.router.navigate(['/invoice', this.userId]);
//   this.router.navigate(['/invoices/user', this.userId]);

// }




}