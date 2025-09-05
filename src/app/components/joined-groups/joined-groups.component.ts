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
  this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
    next: (auctions) => {
      // Extract chit_group_ids from active auctions
      this.activeAuctionGroupIds = auctions.map(a => a.chit_group_id.toString());
    },
    error: (err) => {
      console.error('Error fetching active auctions', err);
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

  
closedAuctionGroupIds: string[] = [];
fetchClosedAuctions() {
  this.http.get<any[]>('http://localhost:8000/auctions/closed/').subscribe({
    next: (auctions) => {
      this.closedAuctionGroupIds = auctions.map(a => a.chit_group_id);
    }
  });
}

// goToInvoice(chitGroupId: string): void {
//   const userId = localStorage.getItem('user_id');
//   if (!userId) {
//     alert('User not logged in.');
//     return;
//   }

//   // Fetch invoices for user
//   this.http.get<any[]>(`http://localhost:8000/auctions/invoices/${userId}/`).subscribe({
//     next: (invoices) => {
//       // Match by chitGroupId as auction_id
//       const invoice = invoices.find(inv => inv.chit_group_id === chitGroupId);
//       if (invoice) {
//         this.router.navigate(['/invoice', invoice._id]);
//       } else {
//         alert('No invoice found for this auction.');
//       }
//     },
//     error: () => {
//       alert('Failed to fetch invoices.');
//     }
//   });
// }
goToInvoice(chitGroupId: string): void {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert('User not logged in.');
    return;
  }

  // Step 1: Get all chit groups and find the one that matches
  this.http.get<any[]>(`http://localhost:8000/api/chit-groups/`).subscribe({
    next: (chitGroups) => {
      const chitGroup = chitGroups.find(cg => cg._id === chitGroupId);

      if (!chitGroup) {
        alert('Chit group not found.');
        return;
      }

      const currentMonth = chitGroup.current_month;
      const closedAuctions = chitGroup.closed_auctions;

      if (!Array.isArray(closedAuctions) || closedAuctions.length < currentMonth - 1) {
        alert('Closed auction data is missing or incomplete.');
        return;
      }

      // Get the last closed auction
      const relevantAuction = closedAuctions[currentMonth - 2]; // zero-based index

      if (!relevantAuction) {
        alert('Relevant auction not found for this month.');
        return;
      }

      const auctionId = relevantAuction
      // Step 2: Fetch invoices and find the one with this auction_id
      this.http.get<any[]>(`http://localhost:8000/auctions/invoices/${userId}/`).subscribe({
        next: (invoices) => {
          const matchingInvoice = invoices.find(
            inv => inv.auction_id === auctionId
          );
          console.log("196 ",matchingInvoice)
          if (matchingInvoice) {
            this.router.navigate(['/invoice', matchingInvoice._id]);
          } else {
            alert('No invoice found for the recent auction.');
          }
        },
        error: () => alert('Failed to fetch invoices.')
      });
    },
    error: () => alert('Failed to fetch chit group data.')
  });
}


isAuctionClosed(chitGroupId: string): boolean {
  // If the ID is not present in the active list, it's considered closed
  return !this.activeAuctionGroupIds.includes(chitGroupId.toString());
}
 // Function to check if the current month is 2 for a specific chit group
  isOrganiserCommissionMonth(chitGroupId: string): boolean {
    const chitGroup = this.joinedGroups.find(cg => cg._id === chitGroupId);
    return chitGroup ? chitGroup.current_month === 2 : false;
  }
}
