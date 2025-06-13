import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {
  exams: any[] = [];
  teacherName: string = 'Teacher';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    // Fetch teacher name from token if you like
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.teacherName = payload?.name || payload?.Name || payload?.username || '';
      } catch (e) {
        this.teacherName = '';
      }
    }

    // Update this URL as per your backend API for teacher's exams
    this.http.get<any[]>('http://localhost:7095/api/Exam/teacher-exams', { headers })
      .subscribe({
        next: (data) => {
          this.exams = data;
        },
        error: (err) => {
          console.error('Failed to fetch exams:', err);
          this.exams = [];
        }
      });
  }

  onViewExams() {
    this.router.navigate(['/teacher/test-series']);
  }

  onCreateExam() {
    this.router.navigate(['/teacher/create-exam']);// Implement navigation to create exams page if needed
  }

  onManageQuestions() {
    // Implement navigation to manage questions page if needed
  }

  onAnalytics() {
    // Implement navigation to analytics page if needed
  }
}