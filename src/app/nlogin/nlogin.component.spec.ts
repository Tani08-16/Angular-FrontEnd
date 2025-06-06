import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NLoginComponent } from './nlogin.component';

describe('NLoginComponent', () => {
  let component: NLoginComponent;
  let fixture: ComponentFixture<NLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
