import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-view-exam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-exam-container" *ngIf="exam">
      <h2>{{ exam.title }}</h2>
      <p>{{ exam.description }}</p>
      <div>
        <b>Total Marks:</b> {{ exam.totalMarks }}
      </div>
      <div>
        <b>Duration:</b> {{ exam.duration }} minutes
      </div>
      <button (click)="router.navigate(['/teacher/test-series'])">Back</button>
      <button (click)="router.navigate(['/teacher/exam/edit', exam.examId])">Edit</button>
    </div>
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
  `,
  styles: [`
    .view-exam-container { max-width: 400px; margin: 2rem auto; padding: 2rem; background: #fafafa; border-radius: 1rem; }
    h2 { margin-bottom: 1rem; }
    p { font-size: 1rem; color: #555; }
    button { margin-top: 1rem; margin-right: 1rem; }
    .error { color: red; font-size: 0.9rem; margin-top: 0.5rem; }
  `]
})
export class ViewExamComponent implements OnInit {
  exam: any;
  loading = false;
  error = '';
  examId!: number;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchExam();
  }

  fetchExam() {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    this.http.get<any>(`http://localhost:7095/api/Exam/${this.examId}`, { headers })
      .subscribe({
        next: (exam) => {
          this.exam = exam;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load exam.';
          this.loading = false;
        }
      });
  }
}