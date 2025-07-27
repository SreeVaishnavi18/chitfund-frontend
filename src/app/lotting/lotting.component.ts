import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lotting',
  templateUrl: './lotting.component.html',
  styleUrls: ['./lotting.component.css']
})
  export class LottingComponent implements OnInit {
    joinedGroups: any[] = [];
    activeGroup: any = null;
    paymentDone = false;
    userId = localStorage.getItem('user_id');
    canBidThisMonth: boolean = false;

    constructor(private http: HttpClient, private router: Router, private route:ActivatedRoute) {}

    ngOnInit() {
      // this.evaluateBidEligibility();
      const groupId = this.route.snapshot.paramMap.get('group_id'); // or whatever param you're using

  if (groupId) {
    this.loadGroupDetails(groupId);
  }

  this.loadActiveAuctions(); // Load auction mapping early
      this.loadJoinedGroups();
    }
loadGroupDetails(groupId: string): void {
  this.http.get<any>(`http://localhost:8000/groups/${groupId}/`).subscribe({
    next: (group) => {
      this.activeGroup = group;
      console.log('Loaded Active Group:', this.activeGroup);
    },
    error: (err) => {
      console.error('Failed to load group details', err);
    }
  });
}

   loadJoinedGroups() {
  const groupIdFromRoute = this.route.snapshot.paramMap.get('groupId');

  this.http.get<any[]>(`http://localhost:8000/users/${this.userId}/chits/`).subscribe({
    next: (data: any) => {
      this.joinedGroups = data;
 console.log("28 grpid ",groupIdFromRoute
 ,this.joinedGroups)
      if (groupIdFromRoute) {
        this.activeGroup = this.joinedGroups.find(group => group.chit_group_id === groupIdFromRoute);

      } else {
        this.activeGroup = this.joinedGroups.find(group => group.status === 'active');
      }

      console.log("Active Group: ", this.activeGroup);
    },
    error: () => {
      alert('Failed to load joined chit groups.');
    }
  });
}


    makePayment() {
  if (!this.activeGroup) {
    alert('No active group selected.');
    return;
  }

  const auctionId = this.activeAuctionMap.get(this.activeGroup.chit_group_id);

  if (!auctionId) {
    alert('No active auction found for this group.');
    return;
  }

  const payload = {
    user_id: this.userId
  };

  this.http.post(`http://localhost:8000/auctions/${auctionId}/mark-paid/`, payload).subscribe({
    next: () => {
      this.paymentDone = true;
      this.evaluateBidEligibility();

      alert('Payment recorded successfully!');
    },
    error: (err) => {
      console.error('Payment update failed', err);
      alert('Failed to mark payment. Try again.');
    }
  });
}


placeBid() {
  if (!this.activeGroup) {
    alert('No active group found.');
    return;
  }

  const auctionId = this.activeAuctionMap.get(this.activeGroup.chit_group_id);

  if (!auctionId) {
    alert('Auction not active for this group.');
    return;
  }

  const bidData = {
    user_id: this.userId,
    amount: '0'
  };

  this.http.post(`http://localhost:8000/auctions/${auctionId}/bid/`, bidData).subscribe({
    next: () => {
      alert('Your lot has been submitted!');
      this.router.navigate(['/joined-groups']);
    },
    error: (err) => {
      alert('Failed to place bid.');
      console.log("err ",err)
    }
  });
}

    activeAuctionMap: Map<string, string> = new Map();

loadActiveAuctions(): void {
  this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
    next: (auctions) => {
      this.activeAuctionMap.clear();
      auctions.forEach(auction => {
        this.activeAuctionMap.set(auction.chit_group_id, auction._id); // or auction.id
      });
    },
    error: (err) => {
      console.error('Failed to fetch active auctions', err);
    }
  });
}

evaluateBidEligibility() {
  console.log("Evaluating eligibility with group:", this.activeGroup, "Payment Done:", this.paymentDone);
  const group = this.activeGroup;
  const userId = this.userId; // assumed to be available

  if (!group || !this.paymentDone) {
    this.canBidThisMonth = false;
    return;
  }

  const currentMonth = group.current_month;
  const previousWinners = group.winners || [];

  // Month 2 is commission month – no one bids
  if (currentMonth === 2) {
    this.canBidThisMonth = false;
    return;
  }

  // Final month check already handled on backend — just skip here

  // If user already won, can't bid again
  const alreadyWon = previousWinners.includes(userId);
  if (alreadyWon) {
    this.canBidThisMonth = false;
    return;
  }

  // If user paid and month is allowed and hasn't won yet
  this.canBidThisMonth = true;
}
}

  