// // signup.component.ts
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-signup',
//   templateUrl: './signup.component.html',
//   styleUrls: ['./signup.component.css']
// })
// export class SignupComponent {
  
//   signupData = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     pincode: '',
//     password: '',
//     confirmPassword: '',
//     agreeTerms: false,
//     newsletter: false
//   };

//   showPassword = false;
//   showConfirmPassword = false;
//   isSubmitting = false;
//   errorMessage = '';
//   successMessage = '';

//   constructor(private router: Router, private http: HttpClient) {}

//   ngOnInit(): void {
//     // Any initialization logic
//   }

//   onSubmit(): void {
//     if (!this.isFormValid()) {
//       this.errorMessage = 'Please fill all required fields correctly.';
//       return;
//     }

//     if (!this.passwordsMatch()) {
//       this.errorMessage = 'Passwords do not match.';
//       return;
//     }

//     this.isSubmitting = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     // Prepare data for API
//     const userData = {
//       name: `${this.signupData.firstName} ${this.signupData.lastName}`,
//       email: this.signupData.email,
//       phone: this.signupData.phone,
//       address: this.signupData.address,
//       city: this.signupData.city,
//       pincode: this.signupData.pincode,
//       password: this.signupData.password,
//       newsletter: this.signupData.newsletter
//     };

//     // Replace with your actual API endpoint
//     this.http.post('http://localhost:8000/api/signup', userData).subscribe({
//       next: (response: any) => {
//         this.isSubmitting = false;
//         this.successMessage = 'Account created successfully! Please check your email for verification.';
        
//         // Redirect to login page after 3 seconds
//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 3000);
//       },
//       error: (error) => {
//         this.isSubmitting = false;
//         this.errorMessage = error.error?.message || 'Failed to create account. Please try again.';
//       }
//     });
//   }

//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPasswordVisibility(): void {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   passwordsMatch(): boolean {
//     return this.signupData.password === this.signupData.confirmPassword;
//   }

//   isFormValid(): boolean {
//     return !!(
//       this.signupData.firstName &&
//       this.signupData.lastName &&
//       this.signupData.email &&
//       this.signupData.phone &&
//       this.signupData.address &&
//       this.signupData.city &&
//       this.signupData.pincode &&
//       this.signupData.password &&
//       this.signupData.confirmPassword &&
//       this.signupData.agreeTerms
//     );
//   }

//   getPasswordStrength(): string {
//     const password = this.signupData.password;
//     if (!password) return '';

//     let score = 0;
    
//     // Length check
//     if (password.length >= 8) score++;
//     if (password.length >= 12) score++;
    
//     // Character variety checks
//     if (/[a-z]/.test(password)) score++;
//     if (/[A-Z]/.test(password)) score++;
//     if (/[0-9]/.test(password)) score++;
//     if (/[^a-zA-Z0-9]/.test(password)) score++;

//     if (score < 3) return 'weak';
//     if (score < 5) return 'medium';
//     return 'strong';
//   }

//   getPasswordStrengthText(): string {
//     const strength = this.getPasswordStrength();
//     switch (strength) {
//       case 'weak': return 'Weak';
//       case 'medium': return 'Medium';
//       case 'strong': return 'Strong';
//       default: return '';
//     }
//   }

//   // Navigation methods (if needed)
//   navigateToLogin(): void {
//     this.router.navigate(['/login']);
//   }

//   navigateToHome(): void {
//     this.router.navigate(['/']);
//   }
// }


// signup.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JSEncrypt } from 'jsencrypt';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    newsletter: false
  };

  publicKey: string = '';
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch RSA public key when component loads
    this.http.get('http://localhost:8000/users/public-key/', { responseType: 'text' }).subscribe({
      next: (key) => this.publicKey = key,
      error: () => this.errorMessage = 'Failed to load encryption key'
    });
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.publicKey) {
      this.errorMessage = 'Encryption key not loaded.';
      return;
    }

    // Encrypt the password
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(this.publicKey);
    const encryptedPassword = encryptor.encrypt(this.signupData.password);

    if (!encryptedPassword) {
      this.errorMessage = 'Password encryption failed.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Prepare encrypted data for API
    const userData = {
      name: `${this.signupData.firstName} ${this.signupData.lastName}`,
      email: this.signupData.email,
      phone: this.signupData.phone,
      address: this.signupData.address,
      city: this.signupData.city,
      pincode: this.signupData.pincode,
      password: encryptedPassword, // send encrypted password
      newsletter: this.signupData.newsletter
    };

    this.http.post('http://localhost:8000/users/signup/', userData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.successMessage = 'Account created successfully! Please check your email for verification.';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Failed to create account. Please try again.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatch(): boolean {
    return this.signupData.password === this.signupData.confirmPassword;
  }

  isFormValid(): boolean {
    return !!(
      this.signupData.firstName &&
      this.signupData.lastName &&
      this.signupData.email &&
      this.signupData.phone &&
      this.signupData.address &&
      this.signupData.city &&
      this.signupData.pincode &&
      this.signupData.password &&
      this.signupData.confirmPassword &&
      this.signupData.agreeTerms
    );
  }

  getPasswordStrength(): string {
    const password = this.signupData.password;
    if (!password) return '';

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
