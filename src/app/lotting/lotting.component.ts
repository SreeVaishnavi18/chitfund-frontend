import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
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
  paymentDetails: any;
  invoiceId: any;
  invoiceDetails: any;

    constructor(private http: HttpClient, private router: Router, private route:ActivatedRoute) {}

    ngOnInit() {
       
        const groupId = this.route.snapshot.paramMap.get('group_id');
        if (groupId) {
          this.loadGroupDetails(groupId);
        }
        this.loadActiveAuctions();
        this.checkPaymentResult();
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

//    loadJoinedGroups() {
//     //get chitgrp id from the response store it and hit api/chits and map the group id and retirve the monthly_contribution
//   const groupIdFromRoute = this.route.snapshot.paramMap.get('groupId');

//   this.http.get<any[]>(`http://localhost:8000/users/${this.userId}/chits/`).subscribe({
//     next: (data: any) => {
//       this.joinedGroups = data;
//  console.log("28 grpid ",groupIdFromRoute
//  ,this.joinedGroups)
//       if (groupIdFromRoute) {
//         this.activeGroup = this.joinedGroups.find(group => group.chit_group_id === groupIdFromRoute);

//       } else {
//         this.activeGroup = this.joinedGroups.find(group => group.status === 'active');
//       }

//       console.log("Active Group: ", this.activeGroup);
//     },
//     error: () => {
//       alert('Failed to load joined chit groups.');
//     }
//   });
// }

monthly_contribution: number = 0;
monthlyContributionMap: { [groupId: string]: number } = {};
loadJoinedGroups() {
  const groupIdFromRoute = this.route.snapshot.paramMap.get('groupId');

  // Step 1: Get joined groups for the user
  this.http.get<any[]>(`http://localhost:8000/users/${this.userId}/chits/`).subscribe({
    next: (joinedData: any[]) => {
      this.joinedGroups = joinedData;
      console.log("Joined Groups: ", this.joinedGroups);

      if (groupIdFromRoute) {
        this.activeGroup = this.joinedGroups.find(group => group.chit_group_id === groupIdFromRoute);
      } else {
        this.activeGroup = this.joinedGroups.find(group => group.status === 'active');
      }

      console.log("Active Group: ", this.activeGroup);

       this.http.get<any[]>(`http://localhost:8000/api/chit-groups/`).subscribe({
          next: (allChits: any[]) => {
            this.joinedGroups = this.joinedGroups.map(jg => {
              const matchingChit = allChits.find(ac => ac._id === jg.chit_group_id);
              if (matchingChit) {
                this.monthlyContributionMap[jg.chit_group_id] = matchingChit.monthly_contribution;
                return {
                  ...jg,
                  monthly_contribution: matchingChit.monthly_contribution
                };
              }
              return jg;
            });

            // Set active group monthly contribution
            if (this.activeGroup) {
              this.monthly_contribution = this.monthlyContributionMap[this.activeGroup.chit_group_id] || 0;
              this.checkPaymentResult();
                this.loadInvoiceDetailsForAuction();

            }

    console.log("Monthly Contribution Map:", this.monthlyContributionMap);
    console.log("Active Group Contribution:", this.monthly_contribution);
  }
});

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
  // let amount:number = 5000;*-
  const amount:string = this.activeGroup?.monthlycontribution;


  const payload = {
    email: 'megha@gmail.com',
    code: 'megha@paygate',
    amount: parseFloat(amount)
  };
  const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
  // const returnUrl = `${window.location.origin}/payment-result?auctionId=${auctionId}`;
  const returnUrl = `${window.location.origin}/lotting/${this.activeGroup.chit_group_id}`;
  // Redirect to payment gateway
  window.location.href = `http://192.168.161.133:3000/payment/${encoded}?returnUrl=${encodeURIComponent(returnUrl)}`;

//   const payload = {
//     // auction_id: auctionId,
//     user_id: this.userId // make sure this is set correctly
//   };

//   this.http.post(`http://localhost:8000/auctions/${auctionId}/markpaid/`, payload).subscribe({
//     next: () => {
//       this.paymentDone = true;
//       this.evaluateBidEligibility();

//       alert('Payment recorded successfully!');
//     },
//     error: (err) => {
//       console.error('Payment update failed', err);
//       alert('Failed to mark payment. Try again.');
//     }
//   });
}

private checkPaymentResult() {
    const encryptedData = this.route.snapshot.queryParamMap.get('data');
    if (encryptedData) {
      try {
        const secretKey = '12345678901234567890123456789012!';
        const bytes = CryptoJS.AES.decrypt(
          decodeURIComponent(encryptedData),
          secretKey
        );
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        this.paymentDetails = JSON.parse(decrypted);
        this.markInvoicePaid()
        this.paymentDone = true;
      } catch (err) {
        console.error('Failed to decrypt payment data', err);
      }
    }
  }


private markInvoicePaid() {
  // Check if payment was successful
  if (!this.paymentDetails?.txId) {
    console.warn('No transaction ID found, skipping invoice marking.');
    return;
  }

  const auctionId = this.activeAuctionMap.get(this.activeGroup?.chit_group_id);
  if (!auctionId) {
    console.error('No active auction found for this group.');
    return;
  }

  const payload = {
    // auction_id: auctionId,
    user_id: this.userId 
  };
  console.log("payload ",payload)

  // Call backend API to mark invoice as paid
  this.http.post(`http://localhost:8000/auctions/${auctionId}/markpaid/`, payload)
    .subscribe({
      next: () => {
        console.log('Invoice marked as paid successfully.');
        this.paymentDone = true;
      this.evaluateBidEligibility();

      alert('Payment recorded successfully!');
        // Optionally update invoice status in frontend
        if (this.invoiceDetails) {
          this.invoiceDetails.is_paid = true;
        }
      },
      error: (err) => {
        console.error('Failed to mark invoice as paid', err);
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

cancelBid() {
  this.router.navigate(['/joined-groups']);
}

loadInvoiceDetailsForAuction() {
  const auctionId = this.activeAuctionMap.get(this.activeGroup?.chit_group_id);
  if (!auctionId || !this.userId) {
    console.warn('No auction ID or user ID found');
    return;
  }

  // Step 1: Get all invoices for the user
  this.http.get<any[]>(`http://localhost:8000/auctions/invoices/${this.userId}/`)
    .subscribe({
      next: (invoices) => {
        // Step 2: Find invoice matching auction_id
        const match = invoices.find(inv => inv.auction_id === auctionId);
        if (match) {
          this.invoiceId = match._id;

          // Step 3: Fetch full invoice details
          this.http.get<any>(`http://localhost:8000/auctions/invoices/detail/${this.invoiceId}/`)
            .subscribe({
              next: (details) => {
                this.invoiceDetails = details;
                console.log('Loaded invoice details:', this.invoiceDetails);
              },
              error: (err) => {
                console.error('Failed to fetch invoice details', err);
              }
            });
        } else {
          console.log('No invoice found for this auction and user.');
        }
      },
      error: (err) => {
        console.error('Failed to fetch user invoices', err);
      }
    });
}

}

  