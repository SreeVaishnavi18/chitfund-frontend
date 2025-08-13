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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.invoiceId = this.route.snapshot.paramMap.get('id') || '';
    this.loadInvoice();
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
    alert('Paid successfully!');
    this.router.navigate(['/joined-groups']);
  }
}
