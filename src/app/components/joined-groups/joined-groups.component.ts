import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-joined-groups',
  templateUrl: './joined-groups.component.html',
  styleUrls: ['./joined-groups.component.css']
})
export class JoinedGroupsComponent implements OnInit {
  userId: string = '';
  joinedGroups: any[] = [];
  errorMsg: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Get user ID from localStorage or a service (you'll store it during login)
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.userId = storedUserId;
      this.fetchJoinedGroups();
    } else {
      this.errorMsg = 'User not logged in.';
    }
  }

  fetchJoinedGroups(): void {
    this.http.get<any[]>(`http://localhost:8000/users/${this.userId}/chits/`)
      .subscribe({
        next: (data) => {
          this.joinedGroups = data;
        },
        error: (error) => {
          this.errorMsg = error.error?.error || 'Error fetching groups.';
        }
      });
  }
}
