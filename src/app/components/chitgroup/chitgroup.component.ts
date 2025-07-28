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

activeAuctionGroupIds: Set<string> = new Set();
allGroups: any[] = [];
auctionGroups: any[] = [];
lotteryGroups: any[] = [];
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
  


  constructor(private chitService: ChitgroupService,
    private route: ActivatedRoute,
    private http: HttpClient, private router:Router
  ) {}

ngOnInit(): void {
  const path = this.route.snapshot.routeConfig?.path;
  
this.loadActiveAuctions();

  if (path?.includes('create')) {
    this.showForm = true;
  }

  if (path?.includes('view')) {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.showList = true;
    this.fetchAllGroups(); // this will internally call loadAuctionStatuses()
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

  fetchAllGroups() {
  this.chitService.getAllChitGroups().subscribe({
    next: (res: any[]) => {
      this.allGroups = res;
      // Split groups
      this.auctionGroups = res.filter(g => g.type === 'auctionbased');
      this.lotteryGroups = res.filter(g => g.type === 'lotterybased');
    },
    error: (err) => {
      console.error('Error fetching chit groups', err);
    }
  });
}



// fetchAllGroups(): void {
//   this.http.get<any[]>('http://localhost:8000/api/chit-groups/').subscribe({
//     next: (groups) => {
//       this.allGroups = groups;
//       this.markStartedAuctions();
//     },
//     error: (err) => {
//       console.error('Failed to fetch chit groups', err);
//     }
//   });
// }

markStartedAuctions(): void {
  this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
    next: (auctions) => {
      const startedIds = new Set(auctions.map(a => String(a.chitgroup_id)));

      this.allGroups.forEach(group => {
        const groupIdStr = String(group._id); // convert ObjectId to string
        group.auctionStarted = startedIds.has(groupIdStr);
      });
    },
    error: (err) => {
      console.error('Failed to fetch active auctions', err);
    }
  });
}

fetchGroupsAndAuctions(): void {
  // Fetch all chit groups
  this.http.get<any[]>('http://localhost:8000/chits/available/').subscribe(groups => {
    this.allGroups = groups;

    // Now fetch all active auctions
    this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe(auctions => {
      const groupIds = auctions.map(a => a.group_id);  // or a.chitgroup_id based on your schema
      this.activeAuctionGroupIds = new Set(groupIds);
    });
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
    next: (res: any) => {
      alert('Auction started successfully.');
      this.auctionStatusMap[chitId] = res.status;
      console.log("Auction status updated:", chitId, res.status);

      // Reload all statuses just in case
      this.loadAuctionStatuses();

      this.router.navigate(['/auction', chitId]);
    },
    error: (err: any) => {
      alert(err.error?.error || 'Failed to start auction.');
    }
  });
}

viewAuction(chitId: string): void {
  this.router.navigate(['/auction', chitId]);
}

loadAuctionStatuses(): void {
  this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
    next: (activeAuctions) => {
      const activeGroupIds = activeAuctions.map(a => a.chitgroup_id); // use actual key if different

      for (const group of this.allGroups) {
        const chitId = group._id;
        this.auctionStatusMap[chitId] = activeGroupIds.includes(chitId) ? 'active' : 'not_started';
      }
    },
    error: (err) => {
      console.error('Failed to fetch active auctions', err);
    }
  });
}
loadActiveAuctions(): void {
  this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
    next: (auctions) => {
      this.activeAuctionGroupIds = new Set(
        auctions.map(a => a.chit_group_id) // assuming it's already a string, or use a.chit_group_id.$oid if it's still an object
      );
    },
    error: (err) => {
      console.error('Failed to fetch active auctions', err);
    }
  });
}

}
