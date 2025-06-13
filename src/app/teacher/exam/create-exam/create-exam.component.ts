import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of, startWith, map } from 'rxjs';

// If using Angular Material (for Autocomplete)
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatAutocompleteModule, MatInputModule]
})
export class CreateExamComponent implements OnInit {
  examForm!: FormGroup;
  categories: any[] = [];
  categoryCtrl = new FormControl('', Validators.required);
  filteredCategories!: Observable<any[]>;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      duration: [60, [Validators.required, Validators.min(1)]],
      totalMarks: [100, [Validators.required, Validators.min(1)]],
      categoryName: this.categoryCtrl // Use as free text/autocomplete
    });

    // Fetch categories for dropdown/autocomplete
    this.http.get<any[]>('http://localhost:7095/api/Exam/exams-by-category')
      .subscribe(data => {
        this.categories = data || [];
        this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCategories(value || ''))
        );
      });
  }

  private _filterCategories(value: string): any[] {
    const filterValue = value?.toLowerCase() || '';
    return this.categories.filter(option =>
      option.categoryName.toLowerCase().includes(filterValue)
    );
  }

  onSubmit() {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    // Prepare payload. If categoryName matches an existing category, you can also send categoryId if your backend supports it.
    const examData = {
      ...this.examForm.value,
      // Optionally, you can find the matching categoryId if needed:
      // categoryId: this.categories.find(c => c.categoryName === this.examForm.value.categoryName)?.categoryId || null,
    };

    // Manually add the Authorization header
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No authentication token found. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:7095/api/Exam', examData, { headers })
      .subscribe({
        next: () => {
          alert('Exam created successfully!');
          this.router.navigate(['/teacher/test-series']);
        },
        error: err => {
          const message = err.error?.message || (typeof err.error === 'string' ? err.error : err.message);
          alert('Error creating exam: ' + message);
        }
      });
  }
}