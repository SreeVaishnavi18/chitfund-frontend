import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableGroupsComponent } from './available-groups.component';

describe('AvailableGroupsComponent', () => {
  let component: AvailableGroupsComponent;
  let fixture: ComponentFixture<AvailableGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableGroupsComponent]
    });
    fixture = TestBed.createComponent(AvailableGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
