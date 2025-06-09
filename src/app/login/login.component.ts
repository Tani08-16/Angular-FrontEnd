import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  isLogin: boolean = true;
  showPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  switchToLogin() {
    this.isLogin = true;
    this.router.navigate(['/login']);
  }

  switchToSignup() {
    this.isLogin = false;
    this.router.navigate(['/signup']);
  }

  onLogin() {
    this.http.post('http://localhost:7095/api/Auth/login', this.loginData)
      .subscribe({
        next: (res: any) => {
          const token = res.token;
          if (!token) {
            alert("Login failed: No token received!");
            return;
          }
          localStorage.setItem('token', token);

          // Set token_expiry for correct isLoggedIn() behavior
          const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes from now
          localStorage.setItem('token_expiry', expiresAt.toString());

          try {
            const decodedToken: any = jwtDecode(token);
            const userRole = decodedToken?.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            localStorage.setItem('userRole', userRole);
            if (!userRole) {
              alert("Login failed: No role found in token!");
              return;
            }

            const dashboardRoutes: Record<string, string> = {
              'Admin': '/admin-dashboard',
              'Teacher': '/teacher-dashboard',
              'Student': '/student-dashboard'
            };

            const redirectTo = dashboardRoutes[userRole];
            if (redirectTo) {
              this.router.navigate([redirectTo]).then(() => {
                // Force Angular to re-evaluate *ngIfs in app.component
                window.dispatchEvent(new Event('storage'));
              });
            } else {
              alert("Unknown role. Cannot navigate.");
            }
          } catch (err) {
            console.error("Invalid token:", err);
            alert("Login failed: Invalid token!");
          }
        },
        error: err => {
          const enteredEmail = this.loginData.email;
          const enteredDomain = enteredEmail.split('@')[1] || '';

          if (enteredDomain === 'examportal.com') {
            alert("Admin Login failed. Please contact Super Admin!");
          } else if (enteredDomain === 'teacherportal.com') {
            alert("Teacher Login failed. Please contact Admin!");
          } else {
            alert("Invalid credentials. Please try again!");
            this.router.navigate(['/signup']);
          }
        }
      });
  }

  onForgotPassword() {
    alert('Forgot Password functionality is not implemented yet.');
  }
}