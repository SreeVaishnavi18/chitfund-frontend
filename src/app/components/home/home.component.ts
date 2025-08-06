// home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.addScrollEffects();
    this.animateStatsOnScroll();
  }

  ngOnDestroy(): void {
    // Clean up event listeners if needed
    window.removeEventListener('scroll', this.handleScroll);
  }

  // Navigation Methods
  navigateToLogin(): void {
    console.log('Navigating to login...');
    this.router.navigate(['/login'])
      .then(success => {
        if (success) {
          console.log('✅ Successfully navigated to login');
        } else {
          console.log('❌ Navigation to login failed');
        }
      })
      .catch(error => console.error('Login navigation error:', error));
  }

  navigateToSignup(): void {
    console.log('Navigating to signup...');
    this.router.navigate(['/signup'])
      .then(success => {
        if (success) {
          console.log('✅ Successfully navigated to signup');
        } else {
          console.log('❌ Navigation to signup failed');
        }
      })
      .catch(error => console.error('Signup navigation error:', error));
  }

  // Alternative navigation with query parameters (if needed)
  navigateWithParams(route: string, params?: any): void {
    this.router.navigate([route], { queryParams: params });
  }

  // Navigate back to home (useful for other components)
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  // Scroll Effects
  private addScrollEffects(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll(): void {
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(102, 126, 234, 0.95)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.1)';
      }
    }
  }

  // Animate Statistics
  private animateStatsOnScroll(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStats();
          observer.disconnect();
        }
      });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  private animateStats(): void {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const element = stat as HTMLElement;
      const target = parseInt(element.textContent?.replace(/[^\d]/g, '') || '0');
      let current = 0;
      const increment = target / 100;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          clearInterval(timer);
          current = target;
        }
        
        if (element.textContent?.includes('₹')) {
          element.textContent = '₹' + Math.floor(current) + ' Cr+';
        } else if (element.textContent?.includes('%')) {
          element.textContent = Math.floor(current) + '%';
        } else if (element.textContent?.includes('+') && !element.textContent?.includes('₹')) {
          element.textContent = Math.floor(current).toLocaleString() + '+';
        } else {
          element.textContent = Math.floor(current) + '+';
        }
      }, 50);
    });
  }

  // Smooth scroll for anchor links (if needed)
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}