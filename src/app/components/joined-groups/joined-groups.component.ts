import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-joined-groups',
  templateUrl: './joined-groups.component.html',
  styleUrls: ['./joined-groups.component.css']
})
export class JoinedGroupsComponent implements OnInit {
  userId: string = '';
  joinedGroups: any[] = [];
  errorMsg: string = '';
  activeAuctionGroupIds: string[] = [];
  auctionGroups: any[] = [];
  lotteryGroups: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadJoinedGroups();
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
          this.auctionGroups = data.filter(group => group.type === 'auctionbased');
          this.lotteryGroups = data.filter(group => group.type === 'lotterybased');
          console.log("40 auction ", this.auctionGroups);
          this.fetchActiveAuctions();
        },
        error: (error) => {
          this.errorMsg = error.error?.error || 'Error fetching groups.';
        }
      });
  }

  loadJoinedGroups() {
    const userId = localStorage.getItem('user_id');

    this.http.get<any[]>(`http://localhost:8000/users/${userId}/chits/`).subscribe({
      next: (data) => {
        this.joinedGroups = data;
        this.fetchActiveAuctions();
      },
      error: () => {
        this.errorMsg = 'Failed to load joined chit groups.';
      }
    });
  }

  fetchActiveAuctions() {
    console.log("fetchActiveAuctions 57");
    this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
      next: (auctions) => {
        this.activeAuctionGroupIds = auctions.map(a => a.chit_group_id);
      }
    });
  }

  isAuctionActive(chitGroupId: string): boolean {
    console.log("bool 66: ", this.activeAuctionGroupIds.includes(chitGroupId.toString()));
    console.log("67 ", this.activeAuctionGroupIds, "chitgrp ", chitGroupId);
    return this.activeAuctionGroupIds.includes(chitGroupId.toString());
  }

  goToAuction(chitGroupId: string): void {
    this.router.navigate(['/auction', chitGroupId]);
  }

  goToLotting(groupId: string): void {
    this.router.navigate(['/lotting', groupId]); // Adjust route as needed
  }

  // Helper methods for the enhanced UI
  getGroupInitials(groupName: string): string {
    if (!groupName) return 'CG';
    return groupName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getStatusClass(chit: any): string {
    if (chit.has_won) return 'won';
    if (!chit.has_paid_initial) return 'pending';
    return 'active';
  }

  getStatusIcon(chit: any): string {
    if (chit.has_won) return 'fa-trophy';
    if (!chit.has_paid_initial) return 'fa-clock';
    return 'fa-play';
  }

  getWonGroupsCount(): number {
    const auctionWon = this.auctionGroups.filter(group => group.has_won).length;
    const lotteryWon = this.lotteryGroups.filter(group => group.has_won).length;
    return auctionWon + lotteryWon;
  }

  getPendingPaymentsCount(): number {
    const auctionPending = this.auctionGroups.filter(group => !group.has_paid_initial).length;
    const lotteryPending = this.lotteryGroups.filter(group => !group.has_paid_initial).length;
    return auctionPending + lotteryPending;
  }
}