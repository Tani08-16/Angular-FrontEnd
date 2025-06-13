import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="edit-exam-container" *ngIf="examForm">
      <h2>Edit Exam</h2>
      <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
        <label>Title:</label>
        <input formControlName="title" />
        <div *ngIf="examForm.get('title')?.invalid && examForm.get('title')?.touched" class="error">Title is required</div>
        <label>Description:</label>
        <textarea formControlName="description"></textarea>
        <label>Duration (minutes):</label>
        <input type="number" formControlName="duration" />
        <label>Total Marks:</label>
        <input type="number" formControlName="totalMarks" />
        <button type="submit" [disabled]="examForm.invalid">Update</button>
        <button type="button" (click)="router.navigate(['/teacher/test-series'])">Cancel</button>
      </form>
    </div>
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
  `,
  styles: [`
    .edit-exam-container { max-width: 400px; margin: 2rem auto; padding: 2rem; background: #fafafa; border-radius: 1rem; }
    label { display: block; margin-top: 1rem; }
    input, textarea { width: 100%; padding: 0.5rem; margin-top: 0.25rem; }
    .error { color: red; font-size: 0.9rem; margin-top: 0.25rem; }
    button { margin-top: 1rem; margin-right: 1rem; }
  `]
})
export class EditExamComponent implements OnInit {
    examForm!: FormGroup;
    loading = false;
    error = '';
    examId!: number;
    categoryId!: number;
    categoryName!: string; // <-- Add this!

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      duration: [60, [Validators.required, Validators.min(1)]],
      totalMarks: [100, [Validators.required, Validators.min(1)]]
    });
    this.fetchExam();
  }

  fetchExam() {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    this.http.get<any>(`http://localhost:7095/api/Exam/${this.examId}`, { headers })
      .subscribe({
        next: (exam) => {
          this.examForm.patchValue(exam);
          this.categoryId = exam.categoryId;
          this.categoryName = exam.categoryName; // <-- Store CategoryName
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load exam.';
          this.loading = false;
        }
      });
  }

  onSubmit() {
    if (this.examForm.invalid) return;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    const updatedExam = {
      ...this.examForm.value,
      categoryId: this.categoryId,
      categoryName: this.categoryName // <-- Send CategoryName!
    };

    this.http.put(`http://localhost:7095/api/Exam/${this.examId}`, updatedExam, { headers })
      .subscribe({
        next: () => {
          alert('Exam updated successfully!');
          this.router.navigate(['/teacher/test-series']);
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to update exam.');
        }
      });
  }
}