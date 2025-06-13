import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Import this
import { NgIf, NgFor } from '@angular/common'; // ✅ Explicit import for template directives
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-students',
  standalone: true, // ✅ Needed for standalone component
  imports: [CommonModule, NgIf, NgFor], // ✅ Add necessary directives
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.css']
})
export class ViewStudentsComponent implements OnInit {
  students: any[] = [];
  isLoading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient, private location: Location) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'Unauthorized: Token not found';
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:7095/api/User/all-users', { headers })
      .subscribe({
        next: (users) => {
          this.students = users.filter(u => u.role?.toLowerCase() === 'student');
          if (this.students.length === 0) {
            this.error = 'No students found.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching students:', err);
          this.error = 'Failed to load student data.';
          this.isLoading = false;
        }
      });
  }

  goBack() {
    this.location.back();
  }
}