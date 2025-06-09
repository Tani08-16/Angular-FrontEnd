import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };

  showPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSignup() {
    const payload = {
      ...this.user,
      role : 'Student' // Default role for signup
    };
      
      this.http.post('http://localhost:7095/api/Auth/register', this.user)
      .subscribe({
        next: () => {
          alert("Signup successful! Please login.");
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error(err);
          alert(err.error?.message || 'Signup failed!');
        }
      });
  }

  switchToLogin() {
    this.router.navigate(['/login']);
  }
}