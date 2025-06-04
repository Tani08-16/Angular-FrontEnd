import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  teacher = {
    name: '',
    email: '',
    password: ''
  };

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  addTeacher() {
    this.successMessage = '';
    this.errorMessage = '';
  
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Authentication token missing!';
      return;
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    this.http.post('http://localhost:7095/api/Auth/add-teacher', this.teacher, { headers })
      .subscribe({
        next: (res: any) => {
          // ✅ Backend returns plain string: "Teacher created successfully."
          this.successMessage = res.message || 'Teacher added successfully!';
          this.teacher = { name: '', email: '', password: '' };
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = typeof err.error === 'string'
            ? err.error
            : err.error?.message || 'Failed to add teacher.';
        }
      });
  }
}