import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotterybasedComponent } from './lotterybased.component';

describe('LotterybasedComponent', () => {
  let component: LotterybasedComponent;
  let fixture: ComponentFixture<LotterybasedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LotterybasedComponent]
    });
    fixture = TestBed.createComponent(LotterybasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
