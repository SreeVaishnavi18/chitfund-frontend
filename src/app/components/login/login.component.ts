
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JSEncrypt } from 'jsencrypt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMsg = '';
  publicKey: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Fetch public key once when component loads
    this.http.get('http://localhost:8000/users/public-key/', { responseType: 'text' }).subscribe({
      next: (key) => this.publicKey = key,
      error: () => this.errorMsg = 'Failed to load encryption key'
    });
  }

  onLogin() {
    if (!this.publicKey) {
      this.errorMsg = 'Encryption key not loaded';
      return;
    }

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(this.publicKey);

    const encryptedPassword = encryptor.encrypt(this.password);
    if (!encryptedPassword) {
      this.errorMsg = 'Encryption failed';
      return;
    }

    const loginData = {
      username: this.username,
      password: encryptedPassword  // send encrypted password here
    };

    this.http.post<any>('http://localhost:8000/users/login/', loginData).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
        if (res.role === 'user') {
          localStorage.setItem('user_id', res.user_id);
          this.router.navigate(['/dashboard']);
        } else if (res.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Login failed.';
      }
    });
  }
}


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
//         localStorage.setItem('username', res.username);
//         localStorage.setItem('role', res.role);

//         if (res.role === 'user') {
//           localStorage.setItem('user_id', res.user_id);  // Store user_id for later use
//           this.router.navigate(['/dashboard']);
//         } else if (res.role === 'admin') {
//           this.router.navigate(['/admin-dashboard']);
//         }
//       },
//       error: (err) => {
//         this.errorMsg = err.error?.error || 'Login failed.';
//       }
//     });
//   }
// }

// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {
//   showOtpWrapper = false;

//   ngOnInit(): void {
//     // Delay rendering until script is loaded
//     setTimeout(() => {
//       this.showOtpWrapper = true;
//     }, 0);
//   }

//   handleOtpComplete(event: any): void {
//     const data = event.detail;
//     console.log('OTP Event Received:', data);

//     if (data.stage === 'submitted') {
//       console.log('OTP sent to:', data.mobile);
//     } else if (data.stage === 'verified') {
//       console.log('OTP verified for:', data.mobile);
//     } else if (data.stage === 'error') {
//       console.error('OTP error:', data.error);
//     }
//   }
// }
