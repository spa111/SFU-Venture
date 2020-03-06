import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeForgottenPasswordComponent } from './change-forgotten-password.component';

describe('ChangeForgottenPasswordComponent', () => {
  let component: ChangeForgottenPasswordComponent;
  let fixture: ComponentFixture<ChangeForgottenPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeForgottenPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeForgottenPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
