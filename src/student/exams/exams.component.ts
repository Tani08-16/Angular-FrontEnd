import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class StudentExamsComponent implements OnInit {
  exams: any[] = [];
  attemptedExamIds: number[] = [];
  userId: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    console.log('🔍 Decoded token:', payload);

    // ✅ Correctly extract userId from the token
    const nameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    this.userId = payload && payload[nameIdentifier] ? parseInt(payload[nameIdentifier]) : 0;
    console.log('✅ User ID:', this.userId);

    this.fetchExams();
    this.fetchResults();
  }

  fetchExams() {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    this.http.get<any[]>('http://localhost:7095/api/Exam', { headers }).subscribe({
      next: (data) => {
        console.log("✅ Fetched exams:", data);
        this.exams = data;
      },
      error: (err) => {
        console.error('❌ Error fetching exams:', err);
        alert('Failed to fetch exams.');
      }
    });
  }

  fetchResults() {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();

    this.http.get<any[]>(`http://localhost:7095/api/Result/user/${this.userId}`, { headers })
      .subscribe({
        next: (data) => {
          console.log("✅ Fetched results:", data);
          this.attemptedExamIds = data.map(r => r.examId);
        },
        error: (err) => {
          console.error('❌ Error fetching results:', err);
        }
      });
  }

  isAttempted(examId: number): boolean {
    return this.attemptedExamIds.includes(examId);
  }

  startExam(examId: number): void {
    this.router.navigate([`/student/exam/${examId}`]);
  }
}