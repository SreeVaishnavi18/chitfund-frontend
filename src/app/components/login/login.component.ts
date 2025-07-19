// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username = '';
//   password = '';
//   errorMsg = '';

//   constructor(private http: HttpClient, private router: Router) {}

//   onLogin() {
//     const loginData = {
//       username: this.username,
//       password: this.password
//     };

//     this.http.post<any>('http://localhost:8000/users/login/', loginData).subscribe({
//       next: (res) => {
//         if (res.role === 'user') {
//           localStorage.setItem('username', res.username);
//           localStorage.setItem('user_id', res.user_id);
//           this.router.navigate(['/dashboard']);
//         } else if (res.role === 'admin')
//           {
//             localStorage.setItem('username', res.username);
//             this.router.navigate(['/admin-dashboard']);
//           }
        
//       },
//       error: (err) => {
//         this.errorMsg = err.error?.error || 'Login failed.';
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showOtpWrapper = false;

  ngOnInit(): void {
    // Delay rendering until script is loaded
    setTimeout(() => {
      this.showOtpWrapper = true;
    }, 0);
  }

  handleOtpComplete(event: any): void {
    const data = event.detail;
    console.log('OTP Event Received:', data);

    if (data.stage === 'submitted') {
      console.log('OTP sent to:', data.mobile);
    } else if (data.stage === 'verified') {
      console.log('OTP verified for:', data.mobile);
    } else if (data.stage === 'error') {
      console.error('OTP error:', data.error);
    }
  }
}
