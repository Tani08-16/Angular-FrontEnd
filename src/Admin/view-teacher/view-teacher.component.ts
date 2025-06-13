import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common'; // 👈 import Location

@Component({
  selector: 'app-view-teacher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-teacher.component.html',
  styleUrls: ['./view-teacher.component.css']
})
export class ViewTeacherComponent implements OnInit {
  allUsers: any[] = [];
  teachers: any[] = [];
  isLoading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient, private location: Location) {} // 👈 inject Location

  ngOnInit(): void {
    this.fetchTeachers();
  }

  fetchTeachers() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'Unauthorized: Token not found';
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:7095/api/User/all-users', { headers }).subscribe({
      next: (users) => {
        this.allUsers = users;
        this.teachers = users.filter(user => user.role?.toLowerCase() === 'teacher');
        if (this.teachers.length === 0) {
          this.error = 'No teachers found.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
        this.error = 'Failed to load teacher data.';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.location.back(); // 👈 navigate back
  }
}