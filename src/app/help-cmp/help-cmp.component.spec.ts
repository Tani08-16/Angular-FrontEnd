import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCmpComponent } from './help-cmp.component';

describe('HelpCmpComponent', () => {
  let component: HelpCmpComponent;
  let fixture: ComponentFixture<HelpCmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpCmpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
