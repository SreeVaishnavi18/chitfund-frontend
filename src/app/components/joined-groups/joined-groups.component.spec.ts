import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedGroupsComponent } from './joined-groups.component';

describe('JoinedGroupsComponent', () => {
  let component: JoinedGroupsComponent;
  let fixture: ComponentFixture<JoinedGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinedGroupsComponent]
    });
    fixture = TestBed.createComponent(JoinedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
