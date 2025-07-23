import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-available-groups',
  templateUrl: './available-groups.component.html',
  styleUrls: ['./available-groups.component.css']
})
export class AvailableGroupsComponent implements OnInit {
  username: string = '';
  availableGroups: any[] = [];
  message: string = '';
  errorMsg: string = '';
  userId: any;

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';

    if (this.username) {
      this.fetchAvailableGroups();
    } else {
      this.errorMsg = 'User not found in local storage.';
    }
  }

  fetchAvailableGroups(): void {
    this.http.get<any[]>(`http://localhost:8000/api/chit-groups/`)
      .subscribe({
        next: (groups) => {
          this.availableGroups = groups;
        },
        error: (err) => {
          this.errorMsg = err.error?.error || 'Could not fetch groups.';
        }
      });
  }

  joinGroup(group:any): void {
    const payload = {
       chit_group_id: group._id,                        // 🔑 Pass group._id
    group_name: group.group_name,
      user_id: localStorage.getItem('user_id'),  // ✅ user ID from localStorage
  username: localStorage.getItem('username') // optional 
    };
console.log("payload: ",payload)
   this.http.post<any>('http://localhost:8000/api/chit-groups/join/', payload)
    .subscribe({
      next: (res) => {
        this.message = res.message;
        this.fetchAvailableGroups();
        this.router.navigate(['/joined-groups']);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || err.error?.message || 'Join failed.';
      }
    });
  }
}
