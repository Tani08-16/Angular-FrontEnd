import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTestSeriesComponent } from './teacher-test-series.component';

describe('TeacherTestSeriesComponent', () => {
  let component: TeacherTestSeriesComponent;
  let fixture: ComponentFixture<TeacherTestSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherTestSeriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherTestSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
