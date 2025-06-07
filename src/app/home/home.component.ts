import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  navigateTo(route: string) {
    if (this.isLoggedIn()) {
      // Navigate to the actual route if logged in
      this.router.navigate([`/${route}`]);
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/login']);
    }
  }
}
