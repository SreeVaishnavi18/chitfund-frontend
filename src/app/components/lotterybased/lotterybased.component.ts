import { Component } from '@angular/core';
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

  constructor(private chitService: ChitgroupService) {}
  displayValues: string[] = [];

  generatePrizeInputs() {
  this.prizeMoneyList = Array(this.totalMembers).fill(0);
  this.displayValues = Array(this.totalMembers).fill('');
}

  onInputChange(value: string, index: number): void {
    const numericValue = Number(value.replace(/,/g, ''));
    this.prizeMoneyList[index] = isNaN(numericValue) ? 0 : numericValue;
    this.displayValues[index] = value;
  }
  formatNumber(value: number): string {
    return value?.toLocaleString('en-IN');
  }

  formatDisplay(index: number): void {
    this.displayValues[index] = this.formatNumber(this.prizeMoneyList[index]);
  }



  createGroup() {
    const chitValue = this.prizeMoneyList.reduce((sum, val) => sum + val, 0);

    const data = {
      group_name: this.groupName,
      chit_value: chitValue,
      duration: this.totalMembers,
      monthly_contribution: this.monthlyContribution,
      total_members: this.totalMembers,
      type: 'lotterybased',
      start_date: this.startDate,
      created_by: this.createdBy,
      prize_money: this.prizeMoneyList
    };

    this.chitService.createChitGroup(data).subscribe({
      next: () => {
        this.successMsg = 'Chit group created successfully.';
        this.errorMsg = '';
      },
      error: (err) => {
        this.errorMsg = 'Failed to create chit group.';
        this.successMsg = '';
        console.error(err);
      }
    });
  }
}
