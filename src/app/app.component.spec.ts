import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userRole: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserRole();
  }

  loadUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userRole = localStorage.getItem('userRole');
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getDashboardLink(): string {
    switch (this.userRole) {
      case 'Admin':
        return '/admin-dashboard';
      case 'Teacher':
        return '/teacher-dashboard';
      case 'Student':
        return '/student-dashboard';
      default:
        return '/home';
    }
  }

  onLogout(): void {
    localStorage.clear();
    this.userRole = null;
    this.router.navigate(['/login']);
  }
}