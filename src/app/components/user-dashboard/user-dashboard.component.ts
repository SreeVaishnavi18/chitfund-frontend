import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  username: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get username from localStorage (set during login)
    this.username = localStorage.getItem('username') || 'User';
  }

  navigateTo(route: string): void {
    this.router.navigate(['/' + route]);
  }
}
