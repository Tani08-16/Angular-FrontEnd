import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  profileDropdownOpen = false;
  private logoutTimer: any;

  constructor(private router: Router, private ngZone: NgZone) {}

  ngOnInit() {
    // Update UI if localStorage changes from another tab/component
    window.addEventListener('storage', () => {
      this.ngZone.run(() => {});
    });
    this.restoreSession();
  }

  setSession(token: string) {
    const expiresAt = Date.now() + 30 * 60 * 1000;
    localStorage.setItem('token', token);
    localStorage.setItem('token_expiry', expiresAt.toString());
    this.setAutoLogout();
  }

  restoreSession() {
    if (!this.isLoggedIn()) {
      this.logout();
    } else {
      this.setAutoLogout();
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('token_expiry');
    if (!token || !expiry) return false;
    const now = Date.now();
    if (now > parseInt(expiry, 10)) {
      this.logout();
      return false;
    }
    return true;
  }

  setAutoLogout() {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    const expiry = localStorage.getItem('token_expiry');
    if (expiry) {
      const timeout = parseInt(expiry, 10) - Date.now();
      if (timeout > 0) {
        this.logoutTimer = setTimeout(() => this.logout(), timeout);
      } else {
        this.logout();
      }
    }
  }

  logout() {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
    this.profileDropdownOpen = false;
  }

  get userRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getDashboardLink(): string {
    const role = this.userRole;
    if (role === 'Admin') return '/admin-dashboard';
    if (role === 'Teacher') return '/teacher-dashboard';
    if (role === 'Student') return '/student-dashboard';
    return '/home';
  }

  onProfileClick(event: Event): void {
    event.preventDefault();
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  onLogout(): void {
    this.logout();
  }

  closeProfileDropdown(): void {
    this.profileDropdownOpen = false;
  }
}