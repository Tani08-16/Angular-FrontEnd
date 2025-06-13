import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-add-teacher',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent {
  teacher = {
    name: '',
    email: '',
    password: ''
  };

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private location: Location) {}

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

  goBack() {
    this.location.back(); // Navigates to previous route
  }
}