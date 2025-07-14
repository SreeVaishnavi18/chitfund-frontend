import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const loginData = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:8000/users/login/', loginData).subscribe({
      next: (res) => {
        if (res.role === 'user') {
          localStorage.setItem('username', res.username);
          localStorage.setItem('user_id', res.user_id);
          this.router.navigate(['/dashboard']);
        } else if (res.role === 'admin')
          {
            localStorage.setItem('username', res.username);
            this.router.navigate(['/admin-dashboard']);
          }
        
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Login failed.';
      }
    });
  }
}
