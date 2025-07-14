import { Component ,OnInit } from '@angular/core';
import { ChitgroupService } from 'src/app/services/chitgroup.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chitgroup',
  templateUrl: './chitgroup.component.html',
  styleUrls: ['./chitgroup.component.css']
})
export class ChitgroupComponent implements OnInit{

  showForm = false;
  showList = false;


  chitData = {
    group_name: '',
    chit_value: null,
    duration: null,
    monthly_contribution: null,
    total_members: null,
    created_by: 'admin123'
  };

  successMsg = '';
  errorMsg = '';
  allGroups: any[] = [];


  constructor(private chitService: ChitgroupService,
    private route: ActivatedRoute

  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;

    if (path?.includes('create')) {
      this.showForm = true;
    }

    if (path?.includes('view')) {
      this.showList = true;
      this.fetchAllGroups();
    }
  }



  


  onSubmit() {
    this.chitService.createChitGroup(this.chitData).subscribe({
      next: (res) => {
        this.successMsg = 'Chit group created successfully!';
        this.errorMsg = '';
        this.resetForm();
        this.fetchAllGroups();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMsg = 'Failed to create chit group.';
        this.successMsg = '';
      }
    });
  }

  fetchAllGroups(): void {
    this.chitService.getAllChitGroups().subscribe({
      next: (data:any[]) => {
        this.allGroups = data;
      },
      error: (err:any) => {
        console.error('Error fetching chit groups:', err);
        this.errorMsg = 'Failed to load chit groups.';
      }
    });
  }



  resetForm() {
    this.chitData = {
      group_name: '',
      chit_value: null,
      duration: null,
      monthly_contribution: null,
      total_members: null,
      created_by: 'admin123'
    };
  }
}
