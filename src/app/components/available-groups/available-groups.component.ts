import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';

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
  joinedGroupId: string = '';
  userId: any;
  auctionGroups: any[] = [];
  lotteryGroups: any[] = [];

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';

    if (this.username) {
      this.fetchAvailableGroups();
    } else {
      this.errorMsg = 'User not found in local storage.';
    }
  }

  fetchAvailableGroups(): void {
    this.http.get<any>(`http://localhost:8000/api/chit-groups/available/${this.username}/`)
      .subscribe({
        next: (res) => {
          this.auctionGroups = res.auctionbased || [];
          this.lotteryGroups = res.lotterybased || [];
        },
        error: (err) => {
          this.errorMsg = err.error?.error || 'Could not fetch groups.';
        }
      });
  }

  joinGroup(group: any): void {
    const payload = {
      chit_group_id: group._id,
      group_name: group.group_name,
      user_id: localStorage.getItem('user_id'),
      username: localStorage.getItem('username') // optional
    };

    this.joinedGroupId = group._id; // track which group user is trying to join
    this.message = '';
    this.errorMsg = '';

    this.http.post<any>('http://localhost:8000/api/chit-groups/join/', payload)
      .subscribe({
        next: (res) => {
          this.snackBar.open(res.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: res.message.includes('already') ? 'snack-warning' : 'snack-success'
          });

          this.fetchAvailableGroups();
          if (!res.message.includes('already')) {
            this.router.navigate(['/joined-groups']);
          }
        },
        error: (err) => {
          this.snackBar.open(err.error?.error || 'Join failed.', 'Close', {
            duration: 3000,
            panelClass: 'snack-error'
          });
        }
      });
  }

  getMasonryCardClass(index: number, type: string): string {
    // Create varied card sizes for masonry effect
    const patterns = ['small-card', 'medium-card', 'large-card'];
    
    // Make every 3rd card larger, and some random variation
    if (index % 4 === 0) return 'large-card';
    if (index % 3 === 0) return 'medium-card';
    return 'small-card';
  }

  getAuctionCardVariant(index: number): string {
    const variants = ['', 'variant-orange', 'variant-cyan', 'variant-lime', 'variant-coral'];
    return variants[index % variants.length];
  }

  getLotteryCardVariant(index: number): string {
    const variants = ['', 'variant-electric', 'variant-mint', 'variant-yellow', 'variant-pink'];
    return variants[index % variants.length];
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


}