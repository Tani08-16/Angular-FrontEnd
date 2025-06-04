import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor], // ✅ Include CommonModule for *ngFor support
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  upcomingExams = [
    { title: 'Math Test', date: 'May 10, 2025' },
    { title: 'Science Quiz', date: 'May 15, 2025' }
  ];

  examResults = [
    { exam: 'English Exam', score: 85 },
    { exam: 'History Test', score: 78 }
  ];
}
 