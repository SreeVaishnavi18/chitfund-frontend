import { Component ,OnInit } from '@angular/core';
import { ChitgroupService } from 'src/app/services/chitgroup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chitgroup',
  templateUrl: './chitgroup.component.html',
  styleUrls: ['./chitgroup.component.css']
})
export class ChitgroupComponent implements OnInit{


  showForm = false;
  showList = false;
  isAdmin:boolean = false;
auctionStatusMap: { [key: string]: string } = {};  // key = chit_group_id, value = status

  chitData = {
    group_name: '',
    chit_value: null,
    duration: null,
    monthly_contribution: null,
    total_members: null,
    type: 'auctionbased',
    created_by: 'admin123'
  };

  successMsg = '';
  errorMsg = '';
  allGroups: any[] = [];


  constructor(private chitService: ChitgroupService,
    private route: ActivatedRoute,
    private http: HttpClient, private router:Router
  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;
    

    if (path?.includes('create')) {
      this.showForm = true;
    }

    if (path?.includes('view')) {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
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
      type: 'auctionbased',
      created_by: 'admin123'
    };
  }

  startAuction(chitId: string): void {
  this.http.post(`http://localhost:8000/auctions/chitgroups/${chitId}/auctions/start/`, {}).subscribe({
    next: (res:any) => {
      alert('Auction started successfully.');
      console.log("104 ",res)
      this.auctionStatusMap[chitId] = res.status;
      console.log("106 ",this.auctionStatusMap[chitId])
       this.router.navigate(['/auction', chitId]);
    },
    error: (err:any) => {
      alert(err.error?.error || 'Failed to start auction.');
    }
  });
}viewAuction(chitId: string): void {
  this.router.navigate(['/auction', chitId]);
}


}
