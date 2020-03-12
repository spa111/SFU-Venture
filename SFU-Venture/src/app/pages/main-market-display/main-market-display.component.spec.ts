import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMarketDisplayComponent } from './main-market-display.component';

describe('MainMarketDisplayComponent', () => {
  let component: MainMarketDisplayComponent;
  let fixture: ComponentFixture<MainMarketDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMarketDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMarketDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
