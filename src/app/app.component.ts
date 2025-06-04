import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getDashboardLink(): string {
    const role = localStorage.getItem('userRole');
    if (role === 'Admin') return '/admin-dashboard';
    if (role === 'Teacher') return '/teacher-dashboard';
    if (role === 'Student') return '/student-dashboard';
    return '/home';
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
