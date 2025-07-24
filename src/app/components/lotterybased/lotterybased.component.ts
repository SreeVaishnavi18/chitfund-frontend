import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChitgroupService } from 'src/app/services/chitgroup.service';

@Component({
  selector: 'app-lotterybased',
  templateUrl: './lotterybased.component.html',
  styleUrls: ['./lotterybased.component.css']
})
export class LotterybasedComponent {
  monthlyContribution = 5000;
  totalMembers = 0;
  prizeMoneyList: number[] = [];
  groupName = '';
  createdBy = 'admin123'; // hardcoded or fetch from session/user service
  startDate: string = new Date().toISOString().split('T')[0]; // today's date
  errorMsg = '';
  successMsg = '';

  constructor(private chitService: ChitgroupService, private router:Router) {}
  displayValues: string[] = [];

generatePrizeInputs() {
  this.prizeMoneyList = Array(this.totalMembers).fill(0);
}

 onInputChange(value: string, index: number) {
  // Optional: Clean and update internal numeric version (if used)
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  this.prizeMoneyList[index] = numericValue;
  this.displayValues[index] = value; // maintain formatted view
}

  formatNumber(value: number): string {
    return value?.toLocaleString('en-IN');
  }

formatDisplay(index: number) {
  const val = this.prizeMoneyList[index];
  if (!isNaN(val)) {
    this.displayValues[index] = `₹${val.toFixed(2)}`;
  }}
trackByIndex(index: number, item: any): number {
  return index;
}



  createGroup() {
    const chitValue = this.prizeMoneyList.reduce((sum, val) => sum + val, 0);

    const data = {
      group_name: this.groupName,
      chit_value: chitValue,
      duration: this.totalMembers,
      monthly_contribution: this.monthlyContribution,
      total_members: this.totalMembers,
      start_date: this.startDate,
      created_by: this.createdBy,
      prize_money: this.prizeMoneyList
    };

    this.chitService.createChitGroup(data).subscribe({
      next: () => {
        this.successMsg = 'Chit group created successfully.';
        this.errorMsg = '';
        this.router.navigate(['chits/view']);
      },
      error: (err) => {
        this.errorMsg = 'Failed to create chit group.';
        this.successMsg = '';
        console.error(err);
      }
    });
  }
}
