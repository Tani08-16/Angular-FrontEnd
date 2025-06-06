import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };
  
  signupSuccess = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSignup() {
    this.http.post('http://localhost:5193/api/Auth/register', this.user)
      .subscribe({
        next: res => {
          alert('Signup successful!');
          this.signupSuccess = true;
        },
        error: err => {
          alert(err.error.message || 'Signup failed!');
        }
      });
  }
}
