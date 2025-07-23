import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionviewComponent } from './auctionview.component';

describe('AuctionviewComponent', () => {
  let component: AuctionviewComponent;
  let fixture: ComponentFixture<AuctionviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuctionviewComponent]
    });
    fixture = TestBed.createComponent(AuctionviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
