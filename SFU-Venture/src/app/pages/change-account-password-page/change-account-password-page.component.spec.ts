import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAccountPasswordPageComponent } from './change-account-password-page.component';

describe('ChangeAccountPasswordPageComponent', () => {
  let component: ChangeAccountPasswordPageComponent;
  let fixture: ComponentFixture<ChangeAccountPasswordPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAccountPasswordPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAccountPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
