import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface TestSeries {
  img: string;
  title: string;
  details: string[];
  attempts: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  allTestSeries: TestSeries[] = [
    {
      img: 'https://cdn-icons-png.flaticon.com/512/3879/3879713.png',
      title: 'UPSC Prelims 2025',
      details: ['10 Full Mocks', '5 Previous Year Papers'],
      attempts: 1520
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/1995/1995476.png',
      title: 'RRB ALP 2025',
      details: ['20 Full Mocks', '10 PYQs'],
      attempts: 2450
    },
    {
      img: 'https://cdn-icons-png.flaticon.com/512/4149/4149646.png',
      title: 'SSC GD Constable',
      details: ['15 Tests', 'New Pattern'],
      attempts: 1780
    }
  ];

  get popularSeries(): TestSeries[] {
    return this.allTestSeries.sort((a, b) => b.attempts - a.attempts).slice(0, 3);
  }

  quotes = [
    "Success is the sum of small efforts repeated daily.",
    "Believe in yourself and all that you are.",
    "Exams are conquered, not feared.",
    "Push your limits, that's where success lives.",
    "You were born to achieve greatness."
  ];
  currentQuoteIndex = 0;
  displayedQuote = '';
  private typeWriterTimeout: any;

  constructor(private router: Router) {
    this.typeWriterEffect();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  navigateTo(route: string) {
    // Anyone can navigate to the test series page
    this.router.navigate([`/${route}`]);
  }

  attemptExam(series: TestSeries) {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      // Navigate to the exam page for the selected test series
      // Adapt the route as per your routing setup
      this.router.navigate(['/exam', series.title]);
    }
  }

  typeWriterEffect() {
    const quote = this.quotes[this.currentQuoteIndex];
    let charIndex = 0;
    this.displayedQuote = '';

    const typeChar = () => {
      if (charIndex < quote.length) {
        this.displayedQuote += quote[charIndex++];
        this.typeWriterTimeout = setTimeout(typeChar, 40);
      } else {
        setTimeout(() => {
          this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
          this.typeWriterEffect();
        }, 1500);
      }
    };
    typeChar();
  }

  ngOnDestroy() {
    clearTimeout(this.typeWriterTimeout);
  }
}