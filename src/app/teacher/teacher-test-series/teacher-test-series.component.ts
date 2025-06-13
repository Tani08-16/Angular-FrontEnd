import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Exam {
  examId: number;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  imageUrl?: string;
}

interface CategoryWithExams {
  categoryId: number;
  categoryName: string;
  exams: Exam[];
}

@Component({
  selector: 'app-teacher-test-series',
  templateUrl: './teacher-test-series.component.html',
  styleUrls: ['./teacher-test-series.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TeacherTestSeriesComponent implements OnInit {
  categories: CategoryWithExams[] = [];
  selectedCategoryId: number | null = null;
  searchTerm: string = '';
  expandedCategoryId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    this.http
      .get<CategoryWithExams[]>('http://localhost:7095/api/Exam/exams-by-category', { headers })
      .subscribe({
        next: (data) => (this.categories = data),
        error: (err) => {
          alert(err.error?.message || 'Failed to load exams.');
          this.categories = [];
        },
      });
  }

  viewExamDetails(examId: number) {
    // Make sure this route exists in your router!
    this.router.navigate(['/teacher/exam', examId]);
  }

  editExam(examId: number) {
    // Make sure this route exists in your router!
    this.router.navigate(['/teacher/exam/edit', examId]);
  }

  deleteExam(examId: number) {
    if (confirm('Are you sure you want to delete this exam?')) {
      const token = localStorage.getItem('token');
      const headers = token
        ? new HttpHeaders({ Authorization: `Bearer ${token}` })
        : undefined;
      this.http
        .delete(`http://localhost:7095/api/Exam/${examId}`, { headers, responseType: 'text'  })
        .subscribe({
          next: () => {
            // Remove from UI
            this.categories.forEach((cat) => {
              cat.exams = cat.exams.filter((exam) => exam.examId !== examId);
            });
            alert('Exam deleted successfully.');
          },
          error: (err) => {
            alert(err.error?.message || 'Failed to delete exam.');
          },
        });
    }
  }

  filteredCategories(): CategoryWithExams[] {
    let filtered = this.categories;
    if (this.selectedCategoryId) {
      filtered = filtered.filter(
        (cat) => cat.categoryId === this.selectedCategoryId
      );
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter((cat) =>
        cat.categoryName.toLowerCase().includes(term)
      );
    }
    return filtered;
  }

  getCategoryColor(categoryId: number): string {
    const colors = [
      'linear-gradient(135deg,#8f6be8 0%,#54c7ec 100%)',
      'linear-gradient(135deg,#32dac3 0%,#36a4f0 100%)',
      'linear-gradient(135deg,#ff855c 0%,#ff5e62 100%)',
      'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)',
      'linear-gradient(135deg,#ee0979 0%,#ff6a00 100%)',
      'linear-gradient(135deg,#42275a 0%,#734b6d 100%)',
      'linear-gradient(135deg,#005c97 0%,#363795 100%)',
      'linear-gradient(135deg,#e65c00 0%,#f9d423 100%)'
    ];
    return colors[categoryId % colors.length];
  }

  toggleCategory(categoryId: number) {
    this.expandedCategoryId =
      this.expandedCategoryId === categoryId ? null : categoryId;
  }
}