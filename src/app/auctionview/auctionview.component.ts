import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-auctionview',
  templateUrl: './auctionview.component.html',
  styleUrls: ['./auctionview.component.css']
})
export class AuctionviewComponent {

  chitId: string = '';
  auctionDetails: any;
  groupDetails: any;
  bids: any[] = []; // initialize as empty array, not undefined
  userBidAmount: number = 0;
  auctionLoaded = false;
  isAdmin = false;
  errorMsg = '';
isLottery: boolean=false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router:Router) {}

  ngOnInit(): void {
    this.chitId = this.route.snapshot.paramMap.get('chitId') || '';

    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';

    this.loadAuction();
    // this.checkAuctionStatus()
  }

  loadAuction() {
  this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
    next: (activeAuctions: any[]) => {
      const auction = activeAuctions.find((a: any) => a.chit_group_id === this.chitId);
      console.log("Active auction:", auction);

      if (!auction) {
        this.errorMsg = 'No active auction found for this chit group.';
        return;
      }

      this.auctionDetails = auction;
      const auctionId = auction._id;
    this.checkAuctionStatus();
    // Step 2: Fetch bids
      this.http.get<any[]>(`http://localhost:8000/auctions/${auctionId}/bids/`).subscribe({
        next: (bidsData: any[]) => {
          // For each bid, fetch the username
          const enrichedBids = bidsData.map((bid) => {
            const headers = new HttpHeaders({ 'X-User-ID': bid.user_id });
              return this.http.get<any>(`http://localhost:8000/users/me/?user_id=${bid.user_id}`).pipe(
                map(user => ({
                  ...bid,
                  username: user.name || 'Unknown'
                }))
              );
            });

          // Combine all username fetch observables
          forkJoin(enrichedBids).subscribe({
            next: (bidsWithUsernames) => {
              this.bids = bidsWithUsernames;
              this.auctionLoaded = true;
            },
            error: () => {
              this.errorMsg = 'Failed to load usernames for bids.';
            }
          });
        },
        error: () => {
          this.errorMsg = 'Failed to load bids.';
        }
      });

      // Step 3: Optionally fetch group details
      this.http.get<any[]>('http://localhost:8000/api/chit-groups/').subscribe({
        next: (chits: any[]) => {
          this.groupDetails = chits.find(group => group._id === this.chitId);
        },
        error: () => {
          this.errorMsg = 'Failed to load chit group details.';
        }
      });
    },
    error: () => {
      this.errorMsg = 'Error fetching auction info.';
    }
  });
}


  placeBid() {
  const userId = localStorage.getItem('user_id');
  if (!this.userBidAmount || !userId) {
    alert('Enter a valid bid amount.');
    return;
  }

  const payload = {
    user_id: userId,
    amount: this.userBidAmount
  };

  this.http.post(`http://localhost:8000/auctions/${this.auctionDetails._id}/bid/`, payload).subscribe({
    next: () => {
      this.userBidAmount = 0;
      this.loadAuction(); // Refresh the bids
    },
    error: (err: any) => {
      alert(err.error?.error || 'Bid failed.');
      this.router.navigate(['/joined-groups'])
    }
  });
}


  loadAuctionDetails() {
  // Load both group and auction details
  this.http.get(`http://localhost:8000/auctions/${this.auctionDetails._id}/details/`)
    .subscribe((data: any) => {
      this.auctionDetails = data.auction;
      this.groupDetails = data.group;
      this.bids = data.bids;

      this.isLottery = data.group.group_type === 'lotterybased';
      this.auctionLoaded = true;
    });
}

stopAuction() {
  this.http.post<any>(`http://localhost:8000/auctions/${this.auctionDetails._id}/close/`, {})
    .subscribe({
      next: (res) => {
        // const winnerId = res.winner?.user_id;
        localStorage.setItem('latest_auction_id', this.auctionDetails._id);

        const winnerId = typeof res.winner === 'string' ? res.winner : res.winner?.user_id;

        if (winnerId) {
          this.http.get<any>(`http://localhost:8000/users/me/?user_id=${winnerId}`).subscribe({
            next: (user) => {
              const winnerName = user.name || 'Unknown';
              alert(`Auction stopped. Winner: ${winnerName}`);
              this.router.navigate(['chits/view']);
            },
            error: () => {
              alert('Auction stopped. Winner: Unknown (failed to fetch username)');
              this.router.navigate(['chits/view']);
            }
          });
        } else {
          alert('Auction stopped. No Winner.');
          this.router.navigate(['chits/view']);
        }
      },
      error: () => alert("Failed to stop the auction."),
    });
}
checkAuctionStatus() {
  if (this.auctionDetails?.status === 'closed') {
    const auctionId = this.auctionDetails._id;

    // 🔐 Get logged-in user ID from localStorage
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      alert('User not logged in.');
      return;
    }

    
    this.http.get<any[]>(`http://localhost:8000/auctions/invoices/${userId}/`).subscribe({
      next: (invoices) => {
        
        const invoice = invoices.find(inv => inv.auction_id === auctionId);

        if (invoice) {
          
          this.router.navigate(['/invoice', invoice._id]);
        } else {
          alert('No invoice found for this auction.');
        }
      },
      error: () => {
        alert('Failed to fetch invoices for user.');
      }
    });
  }
}

}