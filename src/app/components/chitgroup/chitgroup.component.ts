import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ChitgroupService } from 'src/app/services/chitgroup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chitgroup',
  templateUrl: './chitgroup.component.html',
  styleUrls: ['./chitgroup.component.css']
})
export class ChitgroupComponent implements OnInit, AfterViewInit, OnDestroy {

  activeAuctionGroupIds: Set<string> = new Set();
  allGroups: any[] = [];
  auctionGroups: any[] = [];
  lotteryGroups: any[] = [];
  showForm = false;
  showList = false;
  isAdmin: boolean = false;
  isSubmitting: boolean = false;
  auctionStatusMap: { [key: string]: string } = {};

  // Event listeners for cleanup
  private eventListeners: (() => void)[] = [];

  chitData = {
    group_name: '',
    chit_value: null,
    duration: null,
    monthly_contribution: null,
    total_members: 0,
    type: 'auctionbased',
    created_by: 'admin123',
    join_start: '',
    join_end: ''
  };

  successMsg = '';
  errorMsg = '';

  constructor(
    private chitService: ChitgroupService,
    private route: ActivatedRoute,
    private http: HttpClient, 
    private router: Router
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
      this.fetchAllGroups();
    }
  }

  ngAfterViewInit(): void {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.addInteractiveEffects();
    }, 200);
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.eventListeners.forEach(cleanup => cleanup());
  }

  private addInteractiveEffects(): void {
    if (typeof document !== 'undefined') {
      
      // Enhanced parallax effect for cards
      const handleMouseMove = (e: MouseEvent) => {
        const cards = document.querySelectorAll('.group-card');
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        cards.forEach((card: Element, index: number) => {
          const htmlCard = card as HTMLElement;
          if (!htmlCard.matches(':hover')) {
            const intensity = 0.5;
            const rotateX = y * intensity;
            const rotateY = x * intensity;
            
            htmlCard.style.transform = `
              perspective(1000px) 
              rotateX(${rotateX}deg) 
              rotateY(${rotateY}deg)
              translateZ(0)
            `;
          }
        });
      };
      
      // Professional ripple effect for buttons
      const handleButtonClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target instanceof HTMLButtonElement && target.classList.contains('btn') && !target.disabled) {
          const ripple = document.createElement('span');
          const rect = target.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            z-index: 1000;
          `;
          
          target.style.position = 'relative';
          target.style.overflow = 'hidden';
          target.appendChild(ripple);
          
          setTimeout(() => {
            if (ripple.parentNode) {
              ripple.remove();
            }
          }, 600);
        }
      };

      // Subtle floating animation for info items
      const addFloatingEffect = () => {
        const infoItems = document.querySelectorAll('.info-item');
        infoItems.forEach((item: Element, index: number) => {
          const htmlItem = item as HTMLElement;
          htmlItem.style.animationDelay = `${index * 0.2}s`;
          htmlItem.classList.add('floating-item');
        });
      };

      // Card entrance animation
      const addCardAnimations = () => {
        const cards = document.querySelectorAll('.group-card');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const card = entry.target as HTMLElement;
              card.style.animationPlayState = 'running';
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach((card) => {
          observer.observe(card);
        });

        // Store cleanup function
        this.eventListeners.push(() => observer.disconnect());
      };

      // Enhanced hover effects for cards
      const addCardHoverEffects = () => {
        const cards = document.querySelectorAll('.group-card');
        
        cards.forEach((card) => {
          const htmlCard = card as HTMLElement;
          
          const handleMouseEnter = () => {
            htmlCard.style.transform = 'translateY(-8px) scale(1.02)';
            htmlCard.style.zIndex = '10';
          };
          
          const handleMouseLeave = () => {
            htmlCard.style.transform = 'translateY(0) scale(1)';
            htmlCard.style.zIndex = '1';
          };
          
          htmlCard.addEventListener('mouseenter', handleMouseEnter);
          htmlCard.addEventListener('mouseleave', handleMouseLeave);
          
          // Store cleanup functions
          this.eventListeners.push(() => {
            htmlCard.removeEventListener('mouseenter', handleMouseEnter);
            htmlCard.removeEventListener('mouseleave', handleMouseLeave);
          });
        });
      };

      // Add event listeners with cleanup tracking
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleButtonClick);
      
      this.eventListeners.push(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', handleButtonClick);
      });
      
      // Apply effects
      addFloatingEffect();
      addCardAnimations();
      addCardHoverEffects();
    }
  }
  setGroupType(type: 'auctionbased' | 'lotterybased'): void {
  this.chitData.type = type;
}



  onSubmit() {
    this.isSubmitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    const payload = {
      group_name: this.chitData.group_name,
      chit_value: this.chitData.chit_value,
      total_members: this.chitData.total_members,
      duration: this.chitData.total_members + 1,
      // type: 'lotterybased',
      type: this.chitData.type,
      start_date: this.chitData.join_start,
      created_by: 'admin123',
      join_start: this.chitData.join_start,
      join_end: this.chitData.join_end,
      monthly_contribution: 0,
    };

    this.chitService.createChitGroup(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMsg = 'Chit group created successfully!';
        this.errorMsg = '';
        this.resetForm();
        this.fetchAllGroups();
        setTimeout(() => {
        this.router.navigate(['chits/view']);
      }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error:', err);
        this.errorMsg = err?.error?.error || 'Failed to create chit group.';
        this.successMsg = '';
      }
    });
  }

  fetchAllGroups() {
    this.chitService.getAllChitGroups().subscribe({
      next: (res: any[]) => {
        this.allGroups = res;
        this.auctionGroups = res.filter(g => g.type === 'auctionbased');
        this.lotteryGroups = res.filter(g => g.type === 'lotterybased');
        
        // 🎨 Re-apply effects after data loads
        setTimeout(() => {
          this.addInteractiveEffects();
        }, 100);
      },
      error: (err) => {
        console.error('Error fetching chit groups', err);
      }
    });
  }

  markStartedAuctions(): void {
    this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe({
      next: (auctions) => {
        const startedIds = new Set(auctions.map(a => String(a.chitgroup_id)));

        this.allGroups.forEach(group => {
          const groupIdStr = String(group._id);
          group.auctionStarted = startedIds.has(groupIdStr);
        });
      },
      error: (err) => {
        console.error('Failed to fetch active auctions', err);
      }
    });
  }

  fetchGroupsAndAuctions(): void {
    this.http.get<any[]>('http://localhost:8000/chits/available/').subscribe(groups => {
      this.allGroups = groups;

      this.http.get<any[]>('http://localhost:8000/auctions/active/').subscribe(auctions => {
        const groupIds = auctions.map(a => a.group_id);
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
      total_members: 0,
      type: 'auctionbased',
      created_by: 'admin123',
      join_start: '',
      join_end: ''
    };
  }

  startAuction(chitId: string): void {
    this.http.post(`http://localhost:8000/auctions/chitgroups/${chitId}/auctions/start/`, {}).subscribe({
      next: (res: any) => {
        alert('Auction started successfully.');
        this.auctionStatusMap[chitId] = res.status;
        console.log("Auction status updated:", chitId, res.status);
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
        const activeGroupIds = activeAuctions.map(a => a.chitgroup_id);

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
          auctions.map(a => a.chit_group_id)
        );
      },
      error: (err) => {
        console.error('Failed to fetch active auctions', err);
      }
    });
  }
}
