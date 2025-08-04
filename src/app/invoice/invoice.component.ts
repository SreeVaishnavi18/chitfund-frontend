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
    this.http.get(`/auctions/invoices/${this.invoiceId}`).subscribe(
      (data) => this.invoice = data,
      (err) => console.error('Error loading invoice:', err)
    );
  }

  payInvoice() {
    alert('Paid successfully!');
    this.router.navigate(['/joined-groups']);
  }
}
