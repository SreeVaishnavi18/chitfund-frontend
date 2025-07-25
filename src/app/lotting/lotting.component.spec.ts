import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottingComponent } from './lotting.component';

describe('LottingComponent', () => {
  let component: LottingComponent;
  let fixture: ComponentFixture<LottingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LottingComponent]
    });
    fixture = TestBed.createComponent(LottingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
