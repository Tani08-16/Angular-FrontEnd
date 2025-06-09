import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = 'Student';
  totalExams: number = 0;
  attemptedExams: number = 0;
  passedExams: number = 0;
  failedExams: number = 0;
  randomTip: string = '';

  tips = [
    "Practice one exam daily 📝",
    "Understand concepts, not just answers 💡",
    "Stay calm and manage time ⏱️",
    "Revise before you attempt 🚀",
    "Small steps lead to big success 🌱"
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    const userId = payload?.UserId;
    this.studentName = payload?.name || 'Student';

    this.randomTip = this.tips[Math.floor(Math.random() * this.tips.length)];

    this.http.get<any[]>(`https://localhost:7095/api/Exam`).subscribe(data => {
      this.totalExams = data.length;
    });

    this.http.get<any[]>(`https://localhost:7095/api/Result/user/${userId}`).subscribe(results => {
      this.attemptedExams = results.length;
      this.passedExams = results.filter(r => (r.totalMarks / r.exam.totalMarks) * 100 >= 40).length;
      this.failedExams = results.length - this.passedExams;
    });
  }

  goToLeaderboard() {
    this.router.navigate(['/student/leaderboard']);
  }

  goToExams() {
    this.router.navigate(['/student/exams']);
  }

  goToResults() {
    this.router.navigate(['/student/results']);
  }
}