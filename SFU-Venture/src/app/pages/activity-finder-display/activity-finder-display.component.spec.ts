import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFinderDisplayComponent } from './activity-finder-display.component';

describe('ActivityFinderDisplayComponent', () => {
  let component: ActivityFinderDisplayComponent;
  let fixture: ComponentFixture<ActivityFinderDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityFinderDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityFinderDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
