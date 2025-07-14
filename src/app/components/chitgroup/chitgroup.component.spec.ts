import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitgroupComponent } from './chitgroup.component';

describe('ChitgroupComponent', () => {
  let component: ChitgroupComponent;
  let fixture: ComponentFixture<ChitgroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChitgroupComponent]
    });
    fixture = TestBed.createComponent(ChitgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
