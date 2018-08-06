import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportAndSponsorsComponent } from './support-and-sponsors.component';

describe('SupportAndSponsorsComponent', () => {
  let component: SupportAndSponsorsComponent;
  let fixture: ComponentFixture<SupportAndSponsorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportAndSponsorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportAndSponsorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
