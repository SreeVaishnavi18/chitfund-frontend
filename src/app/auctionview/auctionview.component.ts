import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auctionview',
  templateUrl: './auctionview.component.html',
  styleUrls: ['./auctionview.component.css']
})
export class AuctionviewComponent {

  chitId: string = '';
  auctionDetails: any;
  groupDetails: any;
  bids: any[] = [];
  userBidAmount: number = 0;
  auctionLoaded = false;
  isAdmin = false;
  errorMsg = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router:Router) {}

  ngOnInit(): void {
    this.chitId = this.route.snapshot.paramMap.get('id') || '';
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';

    this.loadAuction();
  }

  loadAuction() {
    // Step 1: Get all active auctions
    this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
      next: (activeAuctions:any) => {
        const auction = activeAuctions.find((a: { chit_group_id: string; }) => a.chit_group_id === this.chitId);
        if (!auction) {
          this.errorMsg = 'No active auction found for this chit group.';
          return;
        }
        this.auctionDetails = auction;
        const auctionId = auction._id;

        // Step 2: Fetch bids
        this.http.get<any[]>(`http://localhost:8000/auctions/${auctionId}/bids/`).subscribe({
          next: (bidsData:any) => {
            this.bids = bidsData;
            this.auctionLoaded = true;
          }
        });

        // Step 3: Optionally fetch group details (mocking here)
        this.http.get<any[]>('http://localhost:8000/api/chit-groups/').subscribe({
          next: (chits:any) => {
            this.groupDetails = chits.find((group: { _id: string; }) => group._id === this.chitId);
          }
        });
      },
      error: () => {
        this.errorMsg = 'Error fetching auction info.';
      }
    });
  }

  placeBid() {
    const username = localStorage.getItem('username');
    if (!this.userBidAmount || !username) {
      alert('Enter a valid bid amount.');
      return;
    }

    const payload = {
      username: username,
      amount: this.userBidAmount
    };

    this.http.post(`http://localhost:8000/auctions/${this.auctionDetails._id}/bid/`, payload).subscribe({
      next: () => {
        this.userBidAmount = 0;
        this.loadAuction(); // Refresh the bids
      },
      error: (err:any) => {
        alert(err.error?.error || 'Bid failed.');
      }
    });
  }

  stopAuction() {
    this.http.post(`http://localhost:8000/auctions/${this.auctionDetails._id}/close/`, {}).subscribe({
      next: () => {
        alert('Auction stopped.');
        this.loadAuction();
        this.router.navigate(['chits/view']);
      },
      error: () => {
        alert('Failed to stop auction.');
      }
    });
  }
}
