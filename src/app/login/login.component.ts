import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  isLogin: boolean = true; // Toggle state

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

          try {
            const decodedToken: any = jwtDecode(token);
            const userRole = decodedToken?.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            if (!userRole) {
              alert("Login failed: No role found in token!");
              return;
            }

            localStorage.setItem('userRole', userRole);

            const dashboardRoutes: Record<string, string> = {
              'Admin': '/admin-dashboard',
              'Teacher': '/teacher-dashboard',
              'Student': '/student-dashboard'
            };

            const redirectTo = dashboardRoutes[userRole];
            if (redirectTo) {
              this.router.navigate([redirectTo]);
            } else {
              alert("Unknown role. Cannot navigate.");
            }
          } catch (err) {
            console.error("Invalid token:", err);
            alert("Login failed: Invalid token!");
          }
        },
        error: err => {
          console.error('Login failed:', err);
          alert(err.error?.message || 'Login failed!');
        }
      });
  }
}
