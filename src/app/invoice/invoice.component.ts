import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
 invoiceId: string = '';
  invoice: any;
  groupDetails: any;
  paymentDetails: any;
  paymentDone: boolean=false;
  activeAuctionMap: any;
  activeGroup: any;
  invoiceDetails: any;
  invoices: any[]= [];
  userId: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.invoiceId = this.route.snapshot.paramMap.get('id') || '';
    // this.loadInvoice();
    if (this.invoiceId) {
      // Single invoice view
      this.loadInvoice();
    } else {
      // All invoices list view
      this.userId = localStorage.getItem('user_id') || '';
      this.loadInvoices();
    }

    this. checkPaymentResult()
  }

  loadInvoices() {
  // const userId = localStorage.getItem('user_id') || ''; // get logged-in user ID
  this.http.get<any[]>(`http://localhost:8000/auctions/invoices-with-names/${this.userId}/`).subscribe(
    (data) => {
      // Convert issued_on to IST for all invoices
      this.invoices = data.map(inv => {
        const issuedDateUTC = new Date(inv.issued_on);
        const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
        inv.issued_on = new Date(issuedDateUTC.getTime() + istOffset);
        return inv;
      });
    },
    (err) => console.error('Error loading invoices:', err)
  );
}



  loadInvoice() {
this.http.get<any>(`http://localhost:8000/auctions/invoices/detail/${this.invoiceId}/`).subscribe(
  (data) => {
    // Convert issued_on to IST
    const issuedDateUTC = new Date(data.issued_on);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const issuedDateIST = new Date(issuedDateUTC.getTime() + istOffset);
    data.issued_on = issuedDateIST;

    this.invoice = data;
  },
  (err) => console.error('Error loading invoice:', err)
);
  }
  payInvoice() {
    const chitgroupid = this.invoice.chit_group_id
    const auctionId = this.invoice.auction_id
     this.http.get<any[]>('http://localhost:8000/api/chit-groups/').subscribe({
        next: (chits: any[]) => {
          this.groupDetails = chits.find(group => group._id === chitgroupid);
        },
        error: () => {
          alert('Failed to load chit group details.')
        }
      });
    const amount:string = this.invoice.amount;
    // const payload = {
    // email: 'megha@gmail.com',
    // code: 'megha@paygate',
    // amount: parseFloat(amount)
    // };
    // const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
    // // const returnUrl = `${window.location.origin}/payment-result?auctionId=${auctionId}`;
    // const returnUrl = `${window.location.origin}/lotting/${chitgroupid}`;
    // // Redirect to payment gateway
    // window.location.href = `http://192.168.161.133:3000/payment/${encoded}?returnUrl=${encodeURIComponent(returnUrl)}`;
    // alert('Paid successfully!');
    // this.router.navigate(['/joined-groups']);
    
      const payload = {
        // auction_id: auctionId,
        user_id: this.invoice.user_id
      };
      console.log("payloa d75 ",payload)
      this.http.post(`http://localhost:8000/auctions/${auctionId}/markpaid/`, payload).subscribe({
        next: () => {
          this.paymentDone = true;
          alert('Payment recorded successfully!');
          this.router.navigate(['/joined-groups']);
        },
        error: (err) => {
          console.error('Payment update failed', err);
          alert('Failed to mark payment. Try again.');
        }
      });
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

  const auctionId = this.invoice.auction_id;
  if (!auctionId) {
    console.error('No active auction found for this group.');
    return;
  }

  const payload = {
    // auction_id: auctionId,
    user_id: this.invoice.user_id // make sure this is set correctly
  };
  console.log("payload ",payload)

  // Call backend API to mark invoice as paid
  this.http.post(`http://localhost:8000/auctions/${auctionId}/markpaid/`, payload)
    .subscribe({
      next: () => {
        console.log('Invoice marked as paid successfully.');
        this.paymentDone = true;

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
}
