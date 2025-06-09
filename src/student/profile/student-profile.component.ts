import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-student-profile',
  standalone: true,
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
  imports: [CommonModule, FormsModule],  
})
export class StudentProfileComponent implements OnInit {
  user: any = {};
  profileImageUrl: string | null = null;
  selectedFile: File | null = null;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  photoUploadMsg: string = '';
  photoUploadError: string = '';
  passwordMsg: string = '';
  passwordError: string = '';
  isUploading: boolean = false;
  isUpdatingPassword: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  get avatarLetter(): string {
    if (this.user && this.user.name && typeof this.user.name === 'string') {
      return this.user.name.charAt(0).toUpperCase();
    }
    if (this.user && this.user.email && typeof this.user.email === 'string') {
      return this.user.email.charAt(0).toUpperCase();
    }
    return '?';
  }

  loadProfile(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('http://localhost:7095/api/User/profile', { headers }).subscribe({
      next: (res) => {
        this.user = res;
        this.profileImageUrl = this.user.profileImageUrl
          ? 'http://localhost:7095' + this.user.profileImageUrl + '?t=' + new Date().getTime()
          : null;
      },
      error: () => {
        this.user = {};
        this.profileImageUrl = null;
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
    this.photoUploadMsg = '';
    this.photoUploadError = '';
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.profileImageUrl = e.target.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadPhoto(): void {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.isUploading = true;
    this.photoUploadMsg = '';
    this.photoUploadError = '';

    this.http.post<any>('http://localhost:7095/api/User/upload-photo', formData, { headers }).subscribe({
      next: () => {
        this.photoUploadMsg = 'Photo uploaded successfully!';
        this.photoUploadError = '';
        this.isUploading = false;
        this.selectedFile = null;
        this.loadProfile();
      },
      error: () => {
        this.photoUploadError = 'Failed to upload photo. Try again!';
        this.photoUploadMsg = '';
        this.isUploading = false;
      }
    });
  }

  changePassword(): void {
    this.passwordError = '';
    this.passwordMsg = '';
    if (!this.currentPassword) {
      this.passwordError = 'Please enter your current password.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match!';
      return;
    }
    if (this.currentPassword === this.newPassword) {
      this.passwordError = 'New password cannot be the same as the current password.';
      return;
    }
    this.isUpdatingPassword = true;
    const payload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Expect responseType 'text' because backend returns plain text
    this.http.post('http://localhost:7095/api/User/change-password', payload, { headers, responseType: 'text' }).subscribe({
      next: (res: string) => {
        this.passwordMsg = res || 'Password updated successfully!';
        this.passwordError = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.currentPassword = '';
        this.isUpdatingPassword = false;
      },
      error: (err) => {
        if (typeof err.error === 'string') {
          this.passwordError = err.error;
        } else if (err.error && err.error.message) {
          this.passwordError = err.error.message;
        } else {
          this.passwordError = 'Password update failed. Please try again.';
        }
        this.passwordMsg = '';
        this.isUpdatingPassword = false;
      }
    });
  }
}