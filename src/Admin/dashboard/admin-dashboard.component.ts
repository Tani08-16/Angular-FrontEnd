import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  quotes: string[] = [
    "Leadership is not about a title, it’s about impact.",
    "Great leaders don’t set out to be a leader… they set out to make a difference.",
    "Education is the most powerful weapon which you can use to change the world.",
    "Behind every successful school is a brilliant admin!"
  ];
  currentQuote: string = '';
  private quoteInterval: any;

  ngOnInit(): void {
    this.setRandomQuote();
    this.quoteInterval = setInterval(() => this.setRandomQuote(), 5000);
  }

  ngOnDestroy(): void {
    if (this.quoteInterval) {
      clearInterval(this.quoteInterval);
    }
  }

  setRandomQuote(): void {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[randomIndex];
  }

  constructor(private router: Router) {}

  goToAddTeacher() {
    this.router.navigate(['/admin/add-teacher']);
  }

  goToReports() {
    this.router.navigate(['/admin/reports']);
  }

  goToTeachers() {
    this.router.navigate(['/admin/teachers']);
  }

  goToStudents() {
    this.router.navigate(['/admin/students']);
  }
}