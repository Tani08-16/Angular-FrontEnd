import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';

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
  teacherToDelete: any = null;
  successMessage: string = '';

  constructor(private http: HttpClient, private location: Location) {}

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
    this.location.back();
  }

  confirmDelete(teacher: any) {
    this.teacherToDelete = teacher;
  }

  cancelDelete() {
    this.teacherToDelete = null;
  }

  deleteTeacher() {
    const token = localStorage.getItem('token');
    if (!token || !this.teacherToDelete) return;
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    const userId = this.teacherToDelete.userId;
    const teacherName = this.teacherToDelete.name;
  
    this.http.delete(`http://localhost:7095/api/User/${userId}`, { headers }).subscribe({
      next: () => {
        this.teachers = this.teachers.filter(t => t.userId !== userId);
        this.teacherToDelete = null;
        this.error = ''; // ✅ Clear error message
        this.showSuccessMessage(`${teacherName} removed successfully`);
      },
      error: (err) => {
        console.error('Error deleting teacher:', err);
        this.error = 'Failed to delete teacher.';
        this.teacherToDelete = null;
      }
    });
  }
  
  
  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000); // Hide after 3 seconds
  }
  
  
}
