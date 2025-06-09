import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-test-series',
  templateUrl: './test-series.component.html',
  styleUrls: ['./test-series.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TestSeriesComponent implements OnInit {
  categories: CategoryWithExams[] = [];
  selectedCategoryId: number | null = null;
  searchTerm: string = '';
  expandedCategoryId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<CategoryWithExams[]>('http://localhost:7095/api/Exam/exams-by-category').subscribe({
      next: (data) => this.categories = data,
      error: () => this.categories = []
    });
  }

  startExam(examId: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/student/exam', examId]);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/student/exam/${examId}` } });
    }
  }

  filteredCategories(): CategoryWithExams[] {
    let filtered = this.categories;
    if (this.selectedCategoryId) {
      filtered = filtered.filter(cat => cat.categoryId === this.selectedCategoryId);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(cat => cat.categoryName.toLowerCase().includes(term));
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
    this.expandedCategoryId = this.expandedCategoryId === categoryId ? null : categoryId;
  }
}