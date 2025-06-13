import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AdminProfileComponent implements OnInit {
  user: any = {};
  profileImageUrl: string | null = null;
  selectedFile: File | null = null;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  photoUploadMsg = '';
  photoUploadError = '';
  passwordMsg = '';
  passwordError = '';
  isUploading = false;
  isUpdatingPassword = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  get avatarLetter(): string {
    if (this.user?.name) return this.user.name.charAt(0).toUpperCase();
    if (this.user?.email) return this.user.email.charAt(0).toUpperCase();
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
      },
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
        this.selectedFile = null;
        this.loadProfile();
        this.isUploading = false;
      },
      error: () => {
        this.photoUploadError = 'Failed to upload photo. Try again!';
        this.isUploading = false;
      }
    });
  }

  changePassword(): void {
    this.passwordError = '';
    this.passwordMsg = '';

    if (!this.currentPassword || this.newPassword.length < 6 || this.newPassword !== this.confirmPassword) {
      this.passwordError = this.newPassword !== this.confirmPassword
        ? 'Passwords do not match!'
        : 'Please check all password fields.';
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.passwordError = 'New password cannot be the same as current password.';
      return;
    }

    this.isUpdatingPassword = true;

    const payload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:7095/api/User/change-password', payload, {
      headers,
      responseType: 'text'
    }).subscribe({
      next: (res) => {
        this.passwordMsg = res || 'Password updated successfully!';
        this.currentPassword = this.newPassword = this.confirmPassword = '';
        this.isUpdatingPassword = false;
      },
      error: (err) => {
        this.passwordError = typeof err.error === 'string' ? err.error : 'Password update failed.';
        this.isUpdatingPassword = false;
      }
    });
  }
}